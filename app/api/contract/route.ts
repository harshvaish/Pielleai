// app/api/contract/route.ts
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';

type Anchor = { anchorString: string; offsetX?: number; offsetY?: number; pageNumber?: string };
type Box = { pageNumber: string; x: number | string; y: number | string };

async function fileToBase64(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  return buf.toString('base64');
}

export async function POST(req: NextRequest) {
  // try {
  //   const ct = req.headers.get('content-type') || '';

  //   let signerEmail: string | null = null;
  //   let signerName: string | null = null;
  //   let emailSubject: string | undefined;
  //   let embedded = false;
  //   let clientUserId: string | undefined;
  //   let returnUrl: string | undefined;
  //   let fileName: string | undefined;
  //   let fileBase64: string | null = null;
  //   let anchors: Anchor[] = [];
  //   let boxes: Box[] = [];

  //   if (ct.includes('multipart/form-data')) {
  //     const form = await req.formData();
  //     signerEmail = (form.get('signerEmail') as string) || null;
  //     signerName = (form.get('signerName') as string) || null;
  //     emailSubject = (form.get('emailSubject') as string) || undefined;
  //     embedded = (form.get('embedded') as string) === 'true';
  //     clientUserId = (form.get('clientUserId') as string) || undefined;
  //     returnUrl = (form.get('returnUrl') as string) || undefined;
  //     fileName = (form.get('fileName') as string) || undefined;

  //     const file = form.get('file') as File | null;
  //     if (file) {
  //       fileBase64 = await fileToBase64(file);
  //       fileName ||= file.name;
  //     }
  //     const anchorsJson = form.get('anchors') as string | null;
  //     if (anchorsJson) anchors = JSON.parse(anchorsJson);
  //     const boxesJson = form.get('boxes') as string | null;
  //     if (boxesJson) boxes = JSON.parse(boxesJson);
  //   } else {
  //     const body = await req.json().catch(() => ({} as any));
  //     signerEmail = body.signerEmail ?? null;
  //     signerName = body.signerName ?? null;
  //     emailSubject = body.emailSubject;
  //     embedded = !!body.embedded;
  //     clientUserId = body.clientUserId;
  //     returnUrl = body.returnUrl;
  //     fileName = body.fileName;
  //     fileBase64 = body.fileBase64 ?? null;
  //     anchors = Array.isArray(body.anchors) ? body.anchors : [];
  //     boxes = Array.isArray(body.boxes) ? body.boxes : [];
  //   }

  //   if (!signerEmail || !signerName) {
  //     return NextResponse.json({ success: false, message: 'Missing signerEmail or signerName', data: null }, { status: 400 });
  //   }
  //   if (!fileBase64) {
  //     return NextResponse.json({ success: false, message: 'Missing file (send multipart `file` or JSON `fileBase64`)', data: null }, { status: 400 });
  //   }
  //   if (embedded && !clientUserId) {
  //     return NextResponse.json({ success: false, message: 'For embedded signing, provide clientUserId', data: null }, { status: 400 });
  //   }

  //   // ⬇️ Runtime require to avoid bundling the SDK
  //   const { createRequire } = await import('node:module');
  //   const require = createRequire(import.meta.url);
  //   const {
  //     buildEnvelopeDefinition,
  //     createEnvelope,
  //     createRecipientView
  //   } = require('../../../lib/docusignClient.js'); // adjust relative path if needed

  //   const envelopeDefinition = buildEnvelopeDefinition({
  //     fileBase64,
  //     fileName,
  //     signerEmail,
  //     signerName,
  //     emailSubject,
  //     anchors,
  //     boxes,
  //     embedded,
  //     clientUserId
  //   });

  //   const { envelopeId } = await createEnvelope(envelopeDefinition);

  //   if (embedded && returnUrl) {
  //     const { url } = await createRecipientView({
  //       envelopeId,
  //       returnUrl,
  //       signerEmail,
  //       signerName,
  //       clientUserId
  //     });
  //     return NextResponse.json({ success: true, message: null, data: { envelopeId, signingUrl: url } });
  //   }

  //   return NextResponse.json({ success: true, message: null, data: { envelopeId } });
  // } catch (err: any) {
  //   console.error('DocuSign route error:', err?.response?.text || err);
  //   const msg = err?.response?.text || err?.message || 'DocuSign operation failed';
  //   return NextResponse.json({ success: false, message: msg, data: null }, { status: 500 });
  // }
}
