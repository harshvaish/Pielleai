'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createStripePaymentSession } from '@/lib/stripe/create-payment-session';
import { CreditCard, Loader2 } from 'lucide-react';

type PayWithStripeButtonProps = {
  eventId: number;
  paymentType: 'upfront' | 'final-balance';
  amount: number;
  eventTitle: string;
  venueName: string;
  disabled?: boolean;
};

export default function PayWithStripeButton({
  eventId,
  paymentType,
  amount,
  eventTitle,
  venueName,
  disabled,
}: PayWithStripeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handlePayment = async () => {
    startTransition(async () => {
      const result = await createStripePaymentSession({
        eventId,
        paymentType,
        amount,
        eventTitle,
        venueName,
      });

      if (result.success && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        toast.error(result.message || 'Errore durante la creazione del pagamento');
      }
    });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isPending || disabled}
      className='w-full'
      variant='default'
    >
      {isPending ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Caricamento...
        </>
      ) : (
        <>
          <CreditCard className='mr-2 h-4 w-4' />
          Paga Online (€{amount.toFixed(2)})
        </>
      )}
    </Button>
  );
}
