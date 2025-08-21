import { pdfUploadSchema } from '@/lib/validation/pdfUploadSchema';
import { supabaseServerClient } from '../../../../lib/supabase-server-client';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeFileName } from '@/lib/utils';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parse = pdfUploadSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { name } = parse.data;
  const sanitizedFileName = sanitizeFileName(name);

  const filePath = `pdf/${Date.now()}-${sanitizedFileName}`;

  const { data, error } = await supabaseServerClient.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!).createSignedUploadUrl(filePath);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    path: filePath,
    fileName: sanitizedFileName,
  });
}
