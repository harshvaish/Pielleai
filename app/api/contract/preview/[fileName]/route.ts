import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ fileName: string }>;
};

const normalizeFileName = (value: string | null): string => {
  const base = (value || 'contratto.pdf').replace(/[\\/]/g, '-');
  return base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const { fileName } = await context.params;
    const fileUrl = req.nextUrl.searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, message: 'URL non valido.', data: null },
        { status: 400 },
      );
    }

    const upstream = await fetch(fileUrl);
    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, message: 'Anteprima non disponibile.', data: null },
        { status: 404 },
      );
    }

    const buffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') || 'application/pdf';
    const normalizedFileName = normalizeFileName(fileName);
    const encoded = encodeURIComponent(normalizedFileName);
    const asciiFileName = normalizedFileName
      .replace(/[^\x20-\x7E]/g, '-')
      .replace(/"/g, '');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${asciiFileName}"; filename*=UTF-8''${encoded}`,
      },
    });
  } catch (error) {
    console.error('[contract-preview] error:', error);
    return NextResponse.json(
      { success: false, message: 'Anteprima non disponibile.', data: null },
      { status: 500 },
    );
  }
}
