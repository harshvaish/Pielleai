'use client';

import { Button } from '@/components/ui/button';
import { forgetPassword } from '@/lib/auth-client';
import { RPE_BLOCK_DURATION, RPE_BLOCK_STORAGE_NAME } from '@/lib/constants';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as z from 'zod/v4';

export default function ButtonResendEmail({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // On mount, check if we are still in cooldown
  useEffect(() => {
    const lastSentAt = localStorage.getItem(RPE_BLOCK_STORAGE_NAME);
    if (lastSentAt) {
      const lastTime = parseInt(lastSentAt);
      const expiresAt = lastTime + RPE_BLOCK_DURATION;
      const now = Date.now();

      if (now < expiresAt) {
        setBlockedUntil(expiresAt);
        setTimeLeft(Math.ceil((expiresAt - now) / 1000));
      }
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!blockedUntil) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((blockedUntil - now) / 1000);
      if (remaining <= 0) {
        setBlockedUntil(null);
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  const onClickHandler = async () => {
    setIsLoading(true);

    const validation = z.email('Formato non valido').safeParse(email);

    if (!validation.success) {
      toast.error('Email non trovata o malformata, riprova più tardi');
      setIsLoading(false);
      return;
    }

    await forgetPassword({
      email,
      redirectTo: '/reset-password',
      fetchOptions: {
        onSuccess: () => {
          const now = Date.now();
          const expiresAt = now + RPE_BLOCK_DURATION;
          localStorage.setItem(RPE_BLOCK_STORAGE_NAME, now.toString());
          setBlockedUntil(expiresAt);
          setTimeLeft(Math.ceil(RPE_BLOCK_DURATION / 1000));
          toast.success('Email inviata con successo!');
        },
        onError: (ctx) => {
          const code = ctx?.error?.code ?? 'UNKNOWN_ERROR';
          const message = getBetterAuthErrorMessage(code);
          toast.error(message);
        },
      },
    });
    setIsLoading(false);
  };

  return (
    <Button
      onClick={onClickHandler}
      className='w-full mb-8'
      disabled={isLoading || !!blockedUntil}
    >
      {isLoading
        ? 'Invio email...'
        : blockedUntil
          ? `Invia nuovamente in ${timeLeft} secondi`
          : 'Invia nuovamente'}
    </Button>
  );
}
