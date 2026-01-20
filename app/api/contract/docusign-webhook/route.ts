export const runtime = 'nodejs';
import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { database } from '@/lib/database/connection';
import { supabaseServerClient } from '@/lib/supabase-server-client';
import { sanitizeFileName } from '@/lib/utils';

import { contracts, contractHistory, contractEmailCcs } from '../../../../drizzle/schema';
import sgMail from '@sendgrid/mail';

import { getSignedDocument } from '../../../../docusign/getSignedDocument';

export async function POST(req: NextRequest) {
  try {
    // Optional: if request includes our session (manual hit), enforce admin role; otherwise allow public webhook deliveries
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    // Safe debug (remove later if you want)
    console.log('[docusign-webhook] session?', !!session, 'role:', session?.user?.role);

    if (session && session.user && session.user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Non sei autorizzato.', data: null }, { status: 401 });
    }

    const raw = await req.text();

    // Try to extract envelopeId from common JSON or XML representations
    const envelopeIdMatch =
      raw.match(/"envelopeId"\s*:\s*"([^"}]+)"/i) ||
      raw.match(/<EnvelopeID>([^<]+)<\/EnvelopeID>/i) ||
      raw.match(/EnvelopeID[^>]*>([^<\s]+)</i);

    const envelopeId = envelopeIdMatch ? envelopeIdMatch[1] : null;

    // Check if the event indicates completion
    const completed = /"status"\s*:\s*"completed"/i.test(raw) || /<Status>Completed<\/Status>/i.test(raw) || /completed/i.test(raw);

    if (!envelopeId) {
      console.warn('[docusign-webhook] envelopeId not found in payload');
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!completed) {
      console.log('[docusign-webhook] envelope not completed yet:', envelopeId);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    console.log('[docusign-webhook] envelope completed:', envelopeId);

    // Download signed PDF
    const pdfBuffer = await getSignedDocument(envelopeId);

    // Find contract by envelopeId
    const [contractRow] = await database
      .select({ id: contracts.id, fileName: contracts.fileName, status: contracts.status, recipientEmail: contracts.recipientEmail })
      .from(contracts)
      .where(eq(contracts.envelopeId, envelopeId));

    if (!contractRow) {
      console.warn('[docusign-webhook] no contract found for envelopeId:', envelopeId);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const contractId = contractRow.id;

    // Prepare file name and storage path
    const safeBase = sanitizeFileName((contractRow.fileName || `contract-${contractId}.pdf`).replace(/\.pdf$/i, ''));
    const finalFileName = `${Date.now()}-signed-${safeBase}.pdf`;
    const storagePath = `contracts/${contractId}/${finalFileName}`;

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    if (!bucket) {
      console.error('[docusign-webhook] missing bucket env');
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // Upload signed PDF (use upsert to replace if exists)
    const { error: uploadError } = await supabaseServerClient.storage
      .from(bucket)
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('[docusign-webhook] supabase upload error:', uploadError);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const isPrivateBucket = process.env.SUPABASE_BUCKET_PRIVATE === 'true';

    let fileUrl: string;

    if (!isPrivateBucket) {
      const { data } = supabaseServerClient.storage.from(bucket).getPublicUrl(storagePath);
      fileUrl = data.publicUrl;
    } else {
      fileUrl = `storage://${bucket}/${storagePath}`;
    }

    // Update contract row and insert history
    const prevStatus = contractRow.status;

    if (prevStatus === 'voided') {
      console.log('[docusign-webhook] contract already marked as voided/archived; skipping update and email:', contractId);
      return NextResponse.json({ success: true, message: 'Already archived; nothing to do.' }, { status: 200 });
    }

    await database.transaction(async (tx) => {
      await tx
        .update(contracts)
        .set({ fileUrl, fileName: finalFileName, status: 'voided' })
        .where(eq(contracts.id, contractId));

      await tx.insert(contractHistory).values({
        contractId,
        fromStatus: prevStatus,
        toStatus: 'voided',
        fileUrl,
        fileName: finalFileName,
        changedByUserId: null,
        note: 'File firmato caricato da DocuSign.',
      });
    });

    console.log('[docusign-webhook] signed file uploaded and contract updated:', contractId);

    // Fetch CC emails for this contract
    const ccRows = await database
      .select({ email: contractEmailCcs.email })
      .from(contractEmailCcs)
      .where(eq(contractEmailCcs.contractId, contractId));

    const ccEmails = ccRows.map((r: any) => r.email).filter(Boolean);

    // Send notification email (to recipient, cc contract CCs) with signed PDF attached
    try {
      const apiKey = process.env.SENDGRID_API_KEY;
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'info@eaglebooking.it';

      if (!apiKey) {
        console.warn('[docusign-webhook] SENDGRID_API_KEY missing; skipping notification email');
      } else {
        sgMail.setApiKey(apiKey);

        const toEmail = contractRow.recipientEmail || (ccEmails.length ? ccEmails[0] : null);
        const personalizations: any = { to: toEmail ? [{ email: toEmail }] : [], cc: ccEmails.map((e) => ({ email: e })) };

        // If there's no toEmail (rare), send only to CCs as 'to' recipients
        if (!toEmail && ccEmails.length) {
          personalizations.to = ccEmails.map((e) => ({ email: e }));
          personalizations.cc = [];
        }

        if (personalizations.to.length === 0) {
          console.warn('[docusign-webhook] no recipient or CC emails available; skipping notification email');
        } else {
          const attachment = pdfBuffer.toString('base64');

          const msg: any = {
            ...personalizations,
            from: fromEmail,
            subject: `Contratto firmato (#${contractId})`,
            text: `Il contratto è stato firmato. Scarica il file: ${fileUrl}`,
            html: `<p>Il contratto è stato firmato.</p><p><a href="${fileUrl}">Scarica il documento firmato</a></p>`,
            attachments: [
              {
                content: attachment,
                filename: finalFileName,
                type: 'application/pdf',
                disposition: 'attachment',
              },
            ],
          };

          await sgMail.send(msg);
          console.log('[docusign-webhook] notification email sent for contract', contractId);
        }
      }
    } catch (emailErr) {
      console.error('[docusign-webhook] error sending notification email:', emailErr);
      // do not fail the webhook because of email issues
    }


    // Optionally revalidate pages or trigger other async work here

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[docusign-webhook] error processing webhook:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}