import { pdfUploadSchema } from '@/lib/validation/pdfUploadSchema';
import { supabaseServerClient } from '../../../../lib/supabase-server-client';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeFileName } from '@/lib/utils';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<{ signedUrl: string; path: string; fileName: string }>>> {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validation = pdfUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const { name } = validation.data;
    const sanitizedFileName = sanitizeFileName(name);

    const filePath = `pdf/${Date.now()}-${sanitizedFileName}`;

    const { data, error } = await supabaseServerClient.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!)
      .createSignedUploadUrl(filePath);

    if (error) {
      return NextResponse.json(
        { success: false, message: 'Creazione url di upload non riuscita.', data: null },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: null,
        data: { signedUrl: data.signedUrl, path: filePath, fileName: sanitizedFileName },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Errore nella creazione della url di upload:', error);
    return NextResponse.json(
      { success: false, message: 'Recupero url di upload non riuscito.', data: null },
      { status: 500 },
    );
  }
}
