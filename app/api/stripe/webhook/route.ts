import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/config';
import { database } from '@/lib/database/connection';
import { events } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('[stripe-webhook] Signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const eventId = parseInt(session.metadata?.eventId || '0');
        const paymentType = session.metadata?.paymentType as 'upfront' | 'final-balance';

        if (!eventId || !paymentType) {
          console.error('[stripe-webhook] Missing metadata:', session.metadata);
          break;
        }

        const now = new Date().toISOString();
        const paymentAmount = (session.amount_total || 0) / 100; // Convert from cents

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

          console.log(`[stripe-webhook] Upfront payment completed for event ${eventId}`);
        } else {
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

          console.log(`[stripe-webhook] Final balance completed for event ${eventId}`);
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[stripe-webhook] Session expired: ${session.id}`);
        break;
      }

      default:
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[stripe-webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
