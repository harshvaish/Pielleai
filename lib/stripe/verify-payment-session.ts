'use server';

import { stripe } from '@/lib/stripe/config';
import { database } from '@/lib/database/connection';
import { events } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function verifyStripePaymentSession(sessionId: string, eventId: number) {
  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return {
        success: false,
        message: 'Payment not completed',
      };
    }

    const paymentType = session.metadata?.paymentType as 'upfront' | 'final-balance';
    const now = new Date().toISOString();
    const paymentAmount = (session.amount_total || 0) / 100;

    if (paymentType === 'upfront') {
      // Update upfront payment
      await database
        .update(events)
        .set({
          paymentStatus: 'upfront-paid',
          upfrontPaymentAmount: paymentAmount.toString(),
          upfrontPaymentMethod: 'stripe',
          upfrontPaymentDate: now,
          upfrontPaymentStripeId: session.id,
          upfrontPaymentReference: session.payment_intent as string,
          upfrontPaidAt: now,
          balanceRequiredAt: now,
        })
        .where(eq(events.id, eventId));

      console.log(`[verifyStripePaymentSession] Upfront payment verified for event ${eventId}`);
    } else if (paymentType === 'final-balance') {
      // Update final balance payment
      await database
        .update(events)
        .set({
          paymentStatus: 'fully-paid',
          finalBalanceAmount: paymentAmount.toString(),
          finalBalanceMethod: 'stripe',
          finalBalanceDate: now,
          finalBalanceStripeId: session.id,
          finalBalanceReference: session.payment_intent as string,
          balancePaidAt: now,
          fullyPaidAt: now,
          status: 'confirmed',
          confirmedAt: now,
        })
        .where(eq(events.id, eventId));

      console.log(`[verifyStripePaymentSession] Final balance verified for event ${eventId}`);
    }

    revalidatePath(`/eventi/${eventId}`);

    return {
      success: true,
      message: 'Payment verified and recorded',
      paymentType,
    };
  } catch (error) {
    console.error('[verifyStripePaymentSession] error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify payment',
    };
  }
}
