'use server';

import { database } from '@/lib/database/connection';
import { events, contracts, artistAvailabilities } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function activatePaymentFlowIfContractSigned(eventId: number) {
  try {
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

    // Get contract data
    const contractResults = await database
      .select()
      .from(contracts)
      .where(eq(contracts.eventId, eventId));

    const contractData = contractResults[0];

    console.log('[activatePaymentFlowIfContractSigned]', {
      eventId,
      contractStatus: contractData?.status,
      paymentStatus: eventData?.paymentStatus,
      totalCost: eventData?.totalCost,
    });

    // If contract is signed and payment is still pending, activate payment flow
    if (
      contractData?.status === 'signed' &&
      eventData?.paymentStatus === 'pending'
    ) {
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

      revalidatePath(`/eventi/${eventId}`);

      return {
        success: true,
        message: 'Payment flow activated',
        paymentStatus: 'upfront-required',
      };
    }

    return {
      success: false,
      message: 'Payment flow already activated or contract not signed',
      paymentStatus: eventData?.paymentStatus,
    };
  } catch (error) {
    console.error('[activatePaymentFlowIfContractSigned] error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
