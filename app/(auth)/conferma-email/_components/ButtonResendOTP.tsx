'use client';

import { Button } from '@/components/ui/button';
import { emailOtp } from '@/lib/auth-client';
import { CE_BLOCK_DURATION, CE_BLOCK_STORAGE_NAME } from '@/lib/constants';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import * as z from 'zod/v4';

type ButtonResendOTPProps = {
  email: string;
};

export default function ButtonResendOTP({ email }: ButtonResendOTPProps) {
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  // On mount, check if we are still in cooldown
  useEffect(() => {
    const lastSentAt = localStorage.getItem(CE_BLOCK_STORAGE_NAME);

    if (lastSentAt) {
      const lastTime = parseInt(lastSentAt);
      const expiresAt = lastTime + CE_BLOCK_DURATION;
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
    const validation = z.email('Formato non valido').safeParse(email);

    if (!validation.success) {
      toast.error('Email non trovata o malformata, riprova più tardi');
      return;
    }

    startTransition(async () => {
      await emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
        fetchOptions: {
          onSuccess: () => {
            const now = Date.now();
            const expiresAt = now + CE_BLOCK_DURATION;
            localStorage.setItem(CE_BLOCK_STORAGE_NAME, now.toString());
            setBlockedUntil(expiresAt);
            setTimeLeft(Math.ceil(CE_BLOCK_DURATION / 1000));
            toast.success('Email inviata con successo!');
          },
          onError: (ctx) => {
            const code = ctx?.error?.code ?? 'UNKNOWN_ERROR';
            const message = getBetterAuthErrorMessage(code);
            toast.error(message);
          },
        },
      });
    });
  };

  return (
    <Button
      variant='ghost'
      onClick={onClickHandler}
      disabled={isPending || !!blockedUntil}
      className='text-zinc-500 font-medium'
    >
      {isPending
        ? 'Invio email...'
        : blockedUntil
          ? `Richiedi in ${timeLeft} secondi`
          : 'Richiedi nuovamente'}
    </Button>
  );
}
