'use server';

import { stripe } from '@/lib/stripe/config';
import { database } from '@/lib/database/connection';
import { events } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

type CreatePaymentSessionInput = {
  eventId: number;
  paymentType: 'upfront' | 'final-balance';
  amount: number;
  eventTitle: string;
  venueName: string;
};

export async function createStripePaymentSession(input: CreatePaymentSessionInput) {
  try {
    const { eventId, paymentType, amount, eventTitle, venueName } = input;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${paymentType === 'upfront' ? 'Acconto' : 'Saldo Finale'} - Evento #${eventId}`,
              description: `${eventTitle} - ${venueName}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/eventi/${eventId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/eventi/${eventId}?payment=cancelled`,
      metadata: {
        eventId: eventId.toString(),
        paymentType,
      },
    });

    // Store session ID for tracking
    if (paymentType === 'upfront') {
      await database
        .update(events)
        .set({
          upfrontPaymentStripeId: session.id,
        })
        .where(eq(events.id, eventId));
    } else {
      await database
        .update(events)
        .set({
          finalBalanceStripeId: session.id,
        })
        .where(eq(events.id, eventId));
    }

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('[createStripePaymentSession] error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Errore durante la creazione della sessione di pagamento',
    };
  }
}
