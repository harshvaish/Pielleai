export const runtime = 'nodejs';
import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { supabaseServerClient } from '@/lib/supabase-server-client';
import { sanitizeFileName } from '@/lib/utils';

import { contracts, contractHistory } from '../../../../drizzle/schema';
import { sendPdfForSignature } from '../../../../docusign/docusignClient';

const schema = z.object({
  contractId: z.number().int().positive(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  pageNumber: z.number().int().positive().optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional(),
  anchorString: z.string().optional(),
});

type RequestBody = z.infer<typeof schema>;

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ envelopeId: string; contractId: number }>>> {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    // Safe debug (remove later if you want)
    console.log('[resend-docusign] session?', !!session, 'role:', session?.user?.role);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Non sei autorizzato.', data: null }, { status: 401 });
    }

    const user = session.user;

    const body = await req.json().catch(() => ({} as any));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Dati non corretti.', data: null }, { status: 400 });
    }

    const { contractId, name, email, pageNumber, x, y, anchorString } = parsed.data as RequestBody;

    // Load contract
    const [contract] = await database
      .select({ id: contracts.id, fileUrl: contracts.fileUrl, fileName: contracts.fileName, recipientEmail: contracts.recipientEmail, status: contracts.status })
      .from(contracts)
      .where(eq(contracts.id, contractId));

    if (!contract) {
      return NextResponse.json({ success: false, message: 'Contract non trovato.', data: null }, { status: 404 });
    }

    if (!contract.fileUrl) {
      return NextResponse.json({ success: false, message: 'Nessun file associato al contratto.', data: null }, { status: 400 });
    }

    // Fetch file buffer (handle public URL or storage://bucket/path)
    let pdfBuffer: Buffer | null = null;

    if (String(contract.fileUrl).startsWith('storage://')) {
      const match = String(contract.fileUrl).match(/^storage:\/\/(.+?)\/(.+)$/);
      if (!match) {
        return NextResponse.json({ success: false, message: 'Storage URL non valido.', data: null }, { status: 500 });
      }
      const bucket = match[1];
      const path = match[2];

      const { data, error } = await supabaseServerClient.storage.from(bucket).download(path);
      if (error || !data) {
        console.error('[resend-docusign] supabase download error:', error);
        return NextResponse.json({ success: false, message: 'Download file non riuscito.', data: null }, { status: 500 });
      }
      const arrayBuffer = await data.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } else {
      // public URL: fetch
      const res = await fetch(String(contract.fileUrl));
      if (!res.ok) {
        console.error('[resend-docusign] fetch file error:', res.statusText);
        return NextResponse.json({ success: false, message: 'Download file non riuscito.', data: null }, { status: 500 });
      }
      const ab = await res.arrayBuffer();
      pdfBuffer = Buffer.from(ab);
    }

    if (!pdfBuffer) {
      return NextResponse.json({ success: false, message: 'File buffer non disponibile.', data: null }, { status: 500 });
    }

    // Determine signer info
    const signerEmail = email ?? contract.recipientEmail;
    if (!signerEmail) {
      return NextResponse.json({ success: false, message: 'Email destinatario mancante.', data: null }, { status: 400 });
    }
    const signerName = name ?? 'Signer';

    // Prepare fileName
    const safeBase = sanitizeFileName((contract.fileName || `contract-${contractId}.pdf`).replace(/\.pdf$/i, ''));
    const finalFileName = `${Date.now()}-${safeBase}.pdf`;

    const webhookUrl = process.env.DOCUSIGN_WEBHOOK_URL || undefined;

    // Send to DocuSign
    const placement = anchorString ? { anchorString } : { pageNumber: pageNumber ?? 1, x: x ?? 450, y: y ?? 650 };

    const { envelopeId } = await (sendPdfForSignature as any)({
      pdfBuffer,
      fileName: finalFileName,
      signer: { name: signerName, email: signerEmail },
      placement,
      webhookUrl,
    });

    if (!envelopeId) {
      throw new Error('DocuSign did not return envelopeId');
    }

    // Persist envelopeId and update status
    await database.transaction(async (tx) => {
      await tx.update(contracts).set({ envelopeId, status: 'sent' }).where(eq(contracts.id, contractId));
      await tx.insert(contractHistory).values({
        contractId,
        fromStatus: contract.status ?? null,
        toStatus: 'sent',
        fileUrl: contract.fileUrl ?? null,
        fileName: contract.fileName ?? null,
        changedByUserId: user.id,
        note: 'Documento inviato nuovamente a firma.',
      });
    });

    // revalidate pages
    revalidatePath('/documents');
    revalidatePath(`/documents/${contractId}`);

    return NextResponse.json({ success: true, message: null, data: { envelopeId, contractId } }, { status: 200 });
  } catch (error) {
    console.error('[resend-docusign] error:', error);
    return NextResponse.json({ success: false, message: 'Invio DocuSign non riuscito.', data: null }, { status: 500 });
  }
}