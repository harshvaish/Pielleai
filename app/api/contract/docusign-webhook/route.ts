export const runtime = 'nodejs';
import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';
import { database } from '@/lib/database/connection';
import { supabaseServerClient } from '@/lib/supabase-server-client';
import { sanitizeFileBaseName } from '@/lib/utils';

import { contracts, contractHistory, contractEmailCcs, events, artistAvailabilities } from '../../../../drizzle/schema';
import sgMail from '@sendgrid/mail';

import { getSignedDocument } from '../../../../docusign/getSignedDocument';

export async function POST(req: NextRequest) {
  try {
    console.log('========================================');
    console.log('[docusign-webhook] WEBHOOK CALLED');
    console.log('========================================');
    
    // Optional: if request includes our session (manual hit), enforce admin role; otherwise allow public webhook deliveries
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    console.log('[docusign-webhook] Session exists:', !!session);
    console.log('[docusign-webhook] User role:', session?.user?.role);

    if (session && session.user && session.user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Non sei autorizzato.', data: null }, { status: 401 });
    }

    const raw = await req.text();
    
    console.log('[docusign-webhook] Raw payload (first 500 chars):', raw.substring(0, 500));

    // Try to extract envelopeId from common JSON or XML representations
    const envelopeIdMatch =
      raw.match(/"envelopeId"\s*:\s*"([^"}]+)"/i) ||
      raw.match(/<EnvelopeID>([^<]+)<\/EnvelopeID>/i) ||
      raw.match(/EnvelopeID[^>]*>([^<\s]+)</i);

    const envelopeId = envelopeIdMatch ? envelopeIdMatch[1] : null;
    
    console.log('[docusign-webhook] Extracted envelopeId:', envelopeId);

    // Check if the event indicates completion
    const completed = /"status"\s*:\s*"completed"/i.test(raw) || /<Status>Completed<\/Status>/i.test(raw) || /completed/i.test(raw);
    
    console.log('[docusign-webhook] Is completed?:', completed);
    console.log('[docusign-webhook] Status checks:', {
      jsonStatus: /"status"\s*:\s*"completed"/i.test(raw),
      xmlStatus: /<Status>Completed<\/Status>/i.test(raw),
      generalCompleted: /completed/i.test(raw),
    });

    if (!envelopeId) {
      console.warn('[docusign-webhook] ❌ envelopeId not found in payload');
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!completed) {
      console.log('[docusign-webhook] ⏳ Envelope not completed yet:', envelopeId);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    console.log('[docusign-webhook] ✅ Envelope completed:', envelopeId);

    // Find contract by envelopeId
    console.log('[docusign-webhook] Looking up contract in database...');
    const [contractRow] = await database
      .select({ id: contracts.id, fileName: contracts.fileName, status: contracts.status, recipientEmail: contracts.recipientEmail })
      .from(contracts)
      .where(eq(contracts.envelopeId, envelopeId));

    if (!contractRow) {
      console.warn('[docusign-webhook] ❌ No contract found for envelopeId:', envelopeId);
      return NextResponse.json({ success: true }, { status: 200 });
    }
    
    console.log('[docusign-webhook] Found contract:', {
      contractId: contractRow.id,
      currentStatus: contractRow.status,
      fileName: contractRow.fileName,
    });

    const contractId = contractRow.id;
    const prevStatus = contractRow.status;

    if (prevStatus === 'voided') {
      console.log('[docusign-webhook] ⚠️ Contract already marked as voided; skipping update:', contractId);
      return NextResponse.json({ success: true, message: 'Already voided; nothing to do.' }, { status: 200 });
    }

    if (prevStatus === 'signed') {
      console.log('[docusign-webhook] ✅ Contract already marked as signed; nothing to do:', contractId);
      return NextResponse.json({ success: true, message: 'Already signed; nothing to do.' }, { status: 200 });
    }

    // Download signed PDF (only when we actually need to persist it)
    console.log('[docusign-webhook] Downloading signed PDF...');
    const pdfBuffer = await getSignedDocument(envelopeId);
    console.log('[docusign-webhook] PDF downloaded, size:', pdfBuffer.length, 'bytes');

    // Prepare file name and storage path
    console.log('[docusign-webhook] Preparing file storage...');
    const safeBase = sanitizeFileBaseName(
      (contractRow.fileName || `contract-${contractId}`).replace(/\.pdf$/i, ''),
      `contract-${contractId}`,
      { maxLength: 160 },
    );
    const finalFileName = `${Date.now()}-signed-${safeBase}.pdf`;
    const storagePath = `contracts/${contractId}/${finalFileName}`;
    console.log('[docusign-webhook] Storage path:', storagePath);

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    if (!bucket) {
      console.error('[docusign-webhook] ❌ Missing bucket env');
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // Upload signed PDF (use upsert to replace if exists)
    console.log('[docusign-webhook] Uploading to Supabase...');
    const { error: uploadError } = await supabaseServerClient.storage
      .from(bucket)
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('[docusign-webhook] ❌ Supabase upload error:', uploadError);
      return NextResponse.json({ success: false }, { status: 500 });
    }
    console.log('[docusign-webhook] ✅ File uploaded successfully');

    const isPrivateBucket = process.env.SUPABASE_BUCKET_PRIVATE === 'true';

    let fileUrl: string;

    if (!isPrivateBucket) {
      const { data } = supabaseServerClient.storage.from(bucket).getPublicUrl(storagePath);
      fileUrl = data.publicUrl;
    } else {
      fileUrl = `storage://${bucket}/${storagePath}`;
    }
    
    console.log('[docusign-webhook] File URL:', fileUrl);

    // Update contract row and insert history
    console.log('[docusign-webhook] Previous contract status:', prevStatus);

    // Get contract eventId for payment activation
    console.log('[docusign-webhook] Getting eventId for contract...');
    const [contractWithEvent] = await database
      .select({ eventId: contracts.eventId })
      .from(contracts)
      .where(eq(contracts.id, contractId));

    const eventId = contractWithEvent?.eventId;
    console.log('[docusign-webhook] Event ID:', eventId);

    console.log('[docusign-webhook] Starting database transaction...');
    await database.transaction(async (tx) => {
      console.log('[docusign-webhook] Updating contract status to SIGNED...');
      // Update contract to signed
      await tx
        .update(contracts)
        .set({ fileUrl, fileName: finalFileName, status: 'signed' })
        .where(eq(contracts.id, contractId));
      
      console.log('[docusign-webhook] ✅ Contract status updated to SIGNED');

      console.log('[docusign-webhook] Inserting contract history...');
      await tx.insert(contractHistory).values({
        contractId,
        fromStatus: prevStatus,
        toStatus: 'signed',
        fileUrl,
        fileName: finalFileName,
        changedByUserId: null,
        note: 'File firmato caricato da DocuSign.',
      });
      console.log('[docusign-webhook] ✅ Contract history recorded');

      // Activate payment flow if event exists and payment is pending
      if (eventId) {
        console.log('[docusign-webhook] Checking payment status for event:', eventId);
        const eventResults = await tx
          .select({
            paymentStatus: events.paymentStatus,
            totalCost: events.totalCost,
            startDate: artistAvailabilities.startDate,
          })
          .from(events)
          .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
          .where(eq(events.id, eventId));

        const eventData = eventResults[0];
        console.log('[docusign-webhook] Event payment status:', eventData?.paymentStatus);
        console.log('[docusign-webhook] Event total cost:', eventData?.totalCost);

        if (eventData?.paymentStatus === 'pending') {
          console.log('[docusign-webhook] Activating payment flow...');
          const now = new Date().toISOString();
          const totalCost = eventData.totalCost ? parseFloat(eventData.totalCost) : 0;
          const upfrontAmount = (totalCost * 0.5).toFixed(2);
          const finalBalanceAmount = (totalCost * 0.5).toFixed(2);

          let finalBalanceDeadline = null;
          if (eventData.startDate) {
            const deadline = new Date(eventData.startDate);
            deadline.setDate(deadline.getDate() - 2);
            finalBalanceDeadline = deadline.toISOString();
          }

          await tx
            .update(events)
            .set({
              paymentStatus: 'upfront-required',
              upfrontPaymentAmount: upfrontAmount,
              finalBalanceAmount: finalBalanceAmount,
              finalBalanceDeadline: finalBalanceDeadline,
              paymentPendingAt: now,
              upfrontRequiredAt: now,
            })
            .where(eq(events.id, eventId));

          console.log('[docusign-webhook] ✅ Payment flow activated for event:', eventId);
          console.log('[docusign-webhook] Upfront amount:', upfrontAmount);
          console.log('[docusign-webhook] Final balance:', finalBalanceAmount);
        } else {
          console.log('[docusign-webhook] ⚠️ Payment status not pending, skipping activation. Current status:', eventData?.paymentStatus);
        }
      } else {
        console.log('[docusign-webhook] ⚠️ No eventId found, skipping payment activation');
      }
    });

    console.log('[docusign-webhook] ✅✅✅ Transaction completed successfully');
    console.log('[docusign-webhook] Contract ID:', contractId, 'updated to SIGNED');

    // Revalidate event page if eventId exists
    if (eventId) {
      console.log('[docusign-webhook] Revalidating event page:', eventId);
      revalidatePath(`/eventi/${eventId}`);
      console.log('[docusign-webhook] ✅ Page revalidated');
    }

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
      console.error('[docusign-webhook] ❌ Error sending notification email:', emailErr);
      // do not fail the webhook because of email issues
    }

    console.log('========================================');
    console.log('[docusign-webhook] ✅ WEBHOOK COMPLETED SUCCESSFULLY');
    console.log('========================================');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('========================================');
    console.error('[docusign-webhook] ❌❌❌ ERROR PROCESSING WEBHOOK');
    console.error('[docusign-webhook] Error:', error);
    console.error('========================================');
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
