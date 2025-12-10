// app/api/contract/docusign-document/route.ts
export const runtime = 'nodejs';
import 'server-only';
import path from 'path';
import { createRequire } from 'module';
import { NextRequest, NextResponse } from 'next/server';

const requireNode = createRequire(import.meta.url);

export async function POST(req: NextRequest) {
  try {
    const { name, email, company } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Missing name or email' }, { status: 400 });
    }

    const wrapperPath = path.join(process.cwd(), 'docusign', 'docusignClient.js');
    const ds = requireNode(wrapperPath);
    const { envelopeId } = await ds.sendEnvelope({ name, email, company });

    return NextResponse.json({
      success: true,
      envelopeId,
      message: 'Envelope sent. The signer will receive an email shortly.',
    });
  } catch (err: any) {
    console.error('DocuSign error:', err?.response?.body || err);
    return NextResponse.json(
      { success: false, message: 'Failed to send envelope', error: err?.message },
      { status: 500 }
    );
  }
}
