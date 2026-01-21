'use server';

import { database } from '@/lib/database/connection';
import { events, contracts, artistAvailabilities, contractHistory } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getEnvelopeStatus, getSignedDocument } from '@/docusign/getSignedDocument';
import { supabaseServerClient } from '@/lib/supabase-server-client';
import { sanitizeFileName } from '@/lib/utils';

export async function activatePaymentFlowIfContractSigned(eventId: number) {
  try {
    console.log('[activatePaymentFlow] Checking contract and payment for event:', eventId);

    // Get contract data first
    const contractResults = await database
      .select({
        id: contracts.id,
        status: contracts.status,
        envelopeId: contracts.envelopeId,
        fileName: contracts.fileName,
      })
      .from(contracts)
      .where(eq(contracts.eventId, eventId));

    const contractData = contractResults[0];
    
    if (!contractData) {
      console.log('[activatePaymentFlow] No contract found for event:', eventId);
      return { success: false, message: 'No contract found' };
    }

    console.log('[activatePaymentFlow] Contract status:', contractData.status);
    console.log('[activatePaymentFlow] Envelope ID:', contractData.envelopeId);

    // If contract has envelopeId and is not signed, check DocuSign status
    if (contractData.envelopeId && contractData.status !== 'signed') {
      console.log('[activatePaymentFlow] Checking DocuSign status...');
      try {
        const envelopeStatus: any = await getEnvelopeStatus(contractData.envelopeId);
        const status = envelopeStatus?.status ? String(envelopeStatus.status).toLowerCase() : null;
        
        console.log('[activatePaymentFlow] DocuSign status:', status);

        // If completed in DocuSign, update our database
        if (status === 'completed') {
          console.log('[activatePaymentFlow] Contract is signed in DocuSign, updating...');
          
          // Download signed PDF
          const pdfBuffer = await getSignedDocument(contractData.envelopeId);
          
          // Upload to Supabase
          const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
          const safeBase = sanitizeFileName(
            (contractData.fileName || `contract-${contractData.id}.pdf`).replace(/\.pdf$/i, '')
          );
          const finalFileName = `${Date.now()}-signed-${safeBase}.pdf`;
          const storagePath = `contracts/${contractData.id}/${finalFileName}`;

          const { error: uploadError } = await supabaseServerClient.storage
            .from(bucket)
            .upload(storagePath, pdfBuffer, {
              contentType: 'application/pdf',
              upsert: true,
            });

          if (uploadError) {
            console.error('[activatePaymentFlow] Upload error:', uploadError);
          } else {
            const isPrivateBucket = process.env.SUPABASE_BUCKET_PRIVATE === 'true';
            let fileUrl: string;

            if (!isPrivateBucket) {
              const { data } = supabaseServerClient.storage.from(bucket).getPublicUrl(storagePath);
              fileUrl = data.publicUrl;
            } else {
              fileUrl = `storage://${bucket}/${storagePath}`;
            }

            // Update contract to voided (archived/signed)
            await database
              .update(contracts)
              .set({ fileUrl, fileName: finalFileName, status: 'voided' })
              .where(eq(contracts.id, contractData.id));

            await database.insert(contractHistory).values({
              contractId: contractData.id,
              fromStatus: contractData.status,
              toStatus: 'voided',
              fileUrl,
              fileName: finalFileName,
              changedByUserId: null,
              note: 'Auto-synced from DocuSign on page load.',
            });

            console.log('[activatePaymentFlow] ✅ Contract updated to voided');
          }
        }
      } catch (docusignError) {
        console.error('[activatePaymentFlow] DocuSign check error:', docusignError);
        // Continue with normal flow even if DocuSign check fails
      }
    }

    // Get event data with start date from availability
    const eventResults = await database
      .select({
        paymentStatus: events.paymentStatus,
        totalCost: events.totalCost,
        availabilityId: events.availabilityId,
        startDate: artistAvailabilities.startDate,
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .where(eq(events.id, eventId));

    const eventData = eventResults[0];

    if (!eventData) {
      return { success: false, message: 'Event not found' };
    }

    // Re-fetch contract status after potential update
    const [updatedContract] = await database
      .select({ status: contracts.status })
      .from(contracts)
      .where(eq(contracts.eventId, eventId));

    console.log('[activatePaymentFlow] Updated contract status:', updatedContract?.status);
    console.log('[activatePaymentFlow] Payment status:', eventData.paymentStatus);
    console.log('[activatePaymentFlow] Total cost:', eventData.totalCost);

    // If contract is signed or voided (archived/signed) and payment is still pending, activate payment flow
    if (
      (updatedContract?.status === 'voided' || updatedContract?.status === 'signed') &&
      eventData?.paymentStatus === 'pending'
    ) {
      console.log('[activatePaymentFlow] Activating payment flow...');
      const now = new Date().toISOString();
      const totalCost = eventData.totalCost ? parseFloat(eventData.totalCost) : 0;
      const upfrontAmount = (totalCost * 0.5).toFixed(2);
      const finalBalanceAmount = (totalCost * 0.5).toFixed(2);

      // Calculate final balance deadline (2 days before event)
      let finalBalanceDeadline = null;
      if (eventData.startDate) {
        const deadline = new Date(eventData.startDate);
        deadline.setDate(deadline.getDate() - 2);
        finalBalanceDeadline = deadline.toISOString();
      }

      // Update payment status and amounts
      await database
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

      console.log('[activatePaymentFlow] ✅ Payment flow activated');
      console.log('[activatePaymentFlow] Upfront amount:', upfrontAmount);
      console.log('[activatePaymentFlow] Final balance:', finalBalanceAmount);

      revalidatePath(`/eventi/${eventId}`);

      return {
        success: true,
        message: 'Payment flow activated',
        paymentStatus: 'upfront-required',
      };
    }

    console.log('[activatePaymentFlow] No action needed');
    return {
      success: false,
      message: 'Payment flow already activated or contract not signed',
      paymentStatus: eventData?.paymentStatus,
    };
  } catch (error) {
    console.error('[activatePaymentFlow] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
