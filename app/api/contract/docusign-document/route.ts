export const runtime = 'nodejs';
import 'server-only';
import path from 'path';
import { createRequire } from 'module';
import { NextRequest, NextResponse } from 'next/server';

const requireNode = createRequire(import.meta.url);

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const pageNumber = form.get('pageNumber') ? Number(form.get('pageNumber')) : 1;
    const x = form.get('x') ? Number(form.get('x')) : 450;
    const y = form.get('y') ? Number(form.get('y')) : 650;
    const anchorString = form.get('anchorString') ? String(form.get('anchorString')) : undefined;

    if (!file) return NextResponse.json({ success: false, message: 'Missing file' }, { status: 400 });
    if (!name || !email) return NextResponse.json({ success: false, message: 'Missing name or email' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    const wrapperPath = path.join(process.cwd(), 'docusign', 'docusignClient.js');
    const ds = requireNode(wrapperPath);

    const placement = anchorString ? { anchorString } : { pageNumber, x, y };

    const { envelopeId } = await ds.sendPdfForSignature({
      pdfBuffer,
      fileName: file.name || 'document.pdf',
      signer: { name, email },
      placement,
    });

    return NextResponse.json({
      success: true,
      envelopeId,
      message: '✅ Envelope sent. The signer will receive an email shortly.',
    });
  } catch (err: any) {
    console.error('DocuSign upload error:', err?.response?.body || err);
    return NextResponse.json(
      { success: false, message: 'Failed to send PDF for signature', error: err?.message },
      { status: 500 }
    );
  }
}