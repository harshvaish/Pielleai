export const runtime = 'nodejs';
import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';
import { sanitizeFileName } from '@/lib/utils';
import { database } from '@/lib/database/connection';

import { contracts } from '../../../../drizzle/schema';
import { supabaseServerClient } from '../../../../lib/supabase-server-client';

import { sendPdfForSignature } from '../../../../docusign/docusignClient';

type ResponseData = {
  envelopeId: string;
  contractId: number;
  fileUrl: string;
  fileName: string;
  storagePath: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<ResponseData>>> {
  try {
    // ---- Auth (same pattern as your other API) ----
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    // Safe debug (remove later if you want)
    console.log(
      '[docusign-document] session?',
      !!session,
      'role:',
      session?.user?.role,
    );

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    // ---- Parse multipart/form-data ----
    const form = await req.formData();

    const file = form.get('file') as File | null;
    const contractId = form.get('contractId') ? Number(form.get('contractId')) : NaN;

    const name = String(form.get('name') || '');
    const email = 'l.singh@mokkastudios.com';

    const pageNumber = form.get('pageNumber') ? Number(form.get('pageNumber')) : 1;
    const x = form.get('x') ? Number(form.get('x')) : 450;
    const y = form.get('y') ? Number(form.get('y')) : 650;
    const anchorString = form.get('anchorString')
      ? String(form.get('anchorString'))
      : undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Missing file.', data: null },
        { status: 400 },
      );
    }

    if (!Number.isFinite(contractId) || contractId <= 0) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid contractId.', data: null },
        { status: 400 },
      );
    }

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing name or email.', data: null },
        { status: 400 },
      );
    }

    // ---- Read PDF buffer ----
    const pdfBuffer = Buffer.from(await file.arrayBuffer());

    // ---- Upload to Supabase Storage ----
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    if (!bucket) {
      return NextResponse.json(
        { success: false, message: 'Missing NEXT_PUBLIC_SUPABASE_BUCKET_NAME.', data: null },
        { status: 500 },
      );
    }

    const original = file.name || `contract-${contractId}.pdf`;
    const safeBase = sanitizeFileName(original.replace(/\.pdf$/i, ''));
    const finalFileName = safeBase.toLowerCase().endsWith('.pdf') ? safeBase : `${safeBase}.pdf`;

    const storagePath = `contracts/${contractId}/${Date.now()}-${finalFileName}`;

    const { error: uploadError } = await supabaseServerClient.storage
      .from(bucket)
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Supabase] uploadError:', uploadError);
      return NextResponse.json(
        { success: false, message: 'Upload PDF non riuscito.', data: null },
        { status: 500 },
      );
    }

    const isPrivateBucket = process.env.SUPABASE_BUCKET_PRIVATE === 'true';

    let fileUrl: string;

    if (!isPrivateBucket) {
      const { data } = supabaseServerClient.storage.from(bucket).getPublicUrl(storagePath);
      fileUrl = data.publicUrl;
    } else {
      fileUrl = `storage://${bucket}/${storagePath}`;
    }

    // ---- Update Contract ----
    const updated = await database
      .update(contracts)
      .set({
        fileUrl,
        fileName: finalFileName,
        recipientEmail: email,
        status: 'sent',
      })
      .where(eq(contracts.id, contractId))
      .returning({ id: contracts.id });

    if (!updated.length) {
      await supabaseServerClient.storage.from(bucket).remove([storagePath]);

      return NextResponse.json(
        { success: false, message: 'Contract non trovato.', data: null },
        { status: 404 },
      );
    }

    // ---- Send to DocuSign ----
    const placement = anchorString ? { anchorString } : { pageNumber, x, y };

    const { envelopeId } = await sendPdfForSignature({
      pdfBuffer,
      fileName: finalFileName,
      signer: { name, email },
      placement,
    });

    return NextResponse.json(
      {
        success: true,
        message: null,
        data: {
          envelopeId,
          contractId,
          fileUrl,
          fileName: finalFileName,
          storagePath,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[docusign-document] error:', error);
    return NextResponse.json(
      { success: false, message: 'Operazione non riuscita.', data: null },
      { status: 500 },
    );
  }
}
