import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { contracts, contractHistory, events, artistAvailabilities } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getEnvelopeStatus, getSignedDocument } from '@/docusign/getSignedDocument';
import { supabaseServerClient } from '@/lib/supabase-server-client';
import { sanitizeFileName } from '@/lib/utils';
import getSession from '@/lib/data/auth/get-session';

export async function POST(req: NextRequest) {
  try {
    const { session, user } = await getSession();
    
    if (!session || !user || !['admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { contractId, envelopeId, eventId } = await req.json();

    if (!contractId || !envelopeId) {
      return NextResponse.json(
        { success: false, message: 'Missing contractId or envelopeId' },
        { status: 400 }
      );
    }

    // Get envelope status from DocuSign
    const envelopeStatus: any = await getEnvelopeStatus(envelopeId);
    
    if (!envelopeStatus || !envelopeStatus.status) {
      return NextResponse.json(
        { success: false, message: 'Could not get envelope status from DocuSign' },
        { status: 500 }
      );
    }

    const status = String(envelopeStatus.status).toLowerCase();

    // If not completed, just return current status
    if (status !== 'completed') {
      return NextResponse.json({
        success: true,
        message: `Contract status: ${status}`,
        currentStatus: status,
      });
    }

    // Get current contract data
    const [contractRow] = await database
      .select({
        id: contracts.id,
        status: contracts.status,
        fileName: contracts.fileName,
        eventId: contracts.eventId,
      })
      .from(contracts)
      .where(eq(contracts.id, contractId));

    if (!contractRow) {
      return NextResponse.json(
        { success: false, message: 'Contract not found' },
        { status: 404 }
      );
    }

    // If already signed, nothing to do
    if (contractRow.status === 'signed') {
      return NextResponse.json({
        success: true,
        message: 'Contract already signed',
        currentStatus: 'signed',
      });
    }

    // Download signed PDF
    const pdfBuffer = await getSignedDocument(envelopeId);

    // Upload to Supabase
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    const safeBase = sanitizeFileName(
      (contractRow.fileName || `contract-${contractId}.pdf`).replace(/\.pdf$/i, '')
    );
    const finalFileName = `${Date.now()}-signed-${safeBase}.pdf`;
    const storagePath = `contracts/${contractId}/${finalFileName}`;

    const { error: uploadError } = await supabaseServerClient.storage
      .from(bucket)
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('[sync-docusign] upload error:', uploadError);
      return NextResponse.json(
        { success: false, message: 'Failed to upload signed PDF' },
        { status: 500 }
      );
    }

    const isPrivateBucket = process.env.SUPABASE_BUCKET_PRIVATE === 'true';
    let fileUrl: string;

    if (!isPrivateBucket) {
      const { data } = supabaseServerClient.storage.from(bucket).getPublicUrl(storagePath);
      fileUrl = data.publicUrl;
    } else {
      fileUrl = `storage://${bucket}/${storagePath}`;
    }

    // Update contract and activate payment flow
    await database.transaction(async (tx) => {
      // Update contract to signed
      await tx
        .update(contracts)
        .set({ fileUrl, fileName: finalFileName, status: 'signed' })
        .where(eq(contracts.id, contractId));

      await tx.insert(contractHistory).values({
        contractId,
        fromStatus: contractRow.status,
        toStatus: 'signed',
        fileUrl,
        fileName: finalFileName,
        changedByUserId: user.id,
        note: 'Manually synced from DocuSign - File firmato caricato.',
      });

      // Activate payment flow if event exists and payment is pending
      const actualEventId = eventId || contractRow.eventId;
      if (actualEventId) {
        const eventResults = await tx
          .select({
            paymentStatus: events.paymentStatus,
            totalCost: events.totalCost,
            startDate: artistAvailabilities.startDate,
          })
          .from(events)
          .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
          .where(eq(events.id, actualEventId));

        const eventData = eventResults[0];

        if (eventData?.paymentStatus === 'pending') {
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
            .where(eq(events.id, actualEventId));

          console.log('[sync-docusign] payment flow activated for event:', actualEventId);
        }

        // Revalidate event page
        revalidatePath(`/eventi/${actualEventId}`);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Contract synced and marked as signed',
      currentStatus: 'signed',
    });
  } catch (error) {
    console.error('[sync-docusign] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
