'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyStripePaymentSession } from '@/lib/stripe/verify-payment-session';
import { toast } from 'sonner';

type PaymentSuccessHandlerProps = {
  eventId: number;
};

export default function PaymentSuccessHandler({ eventId }: PaymentSuccessHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (paymentStatus === 'success' && sessionId && !processing) {
      setProcessing(true);

      // Verify and update payment in database
      verifyStripePaymentSession(sessionId, eventId)
        .then((result) => {
          if (result.success) {
            toast.success('Pagamento confermato con successo!');
          } else {
            toast.error(result.message || 'Errore nella verifica del pagamento');
          }

          // Remove query params from URL
          router.replace(`/eventi/${eventId}`);
        })
        .catch((error) => {
          console.error('Payment verification error:', error);
          toast.error('Errore nella verifica del pagamento');
          router.replace(`/eventi/${eventId}`);
        });
    } else if (paymentStatus === 'cancelled') {
      toast.info('Pagamento annullato');
      router.replace(`/eventi/${eventId}`);
    }
  }, [searchParams, eventId, router, processing]);

  return null;
}
