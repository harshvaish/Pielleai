'use client';

import { Button } from '@/components/ui/button';
import { forgetPassword } from '@/lib/auth-client';
import {
  RPE_BLOCK_DURATION,
  RPE_BLOCK_STORAGE_NAME,
  RPE_EMAIL_STORAGE_NAME,
} from '@/lib/constants';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { emailValidation } from '@/lib/validation/_general';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ButtonResendEmail() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState<string | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const email = localStorage.getItem(RPE_EMAIL_STORAGE_NAME);
    const validation = emailValidation.safeParse(email);

    if (!validation.success) {
      localStorage.removeItem(RPE_EMAIL_STORAGE_NAME);
      router.replace('/recupera-password');
    }

    setEmail(email);
  }, [router]);

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
    startTransition(async () => {
      // await forgetPassword({
      //   email: email!,
      //   redirectTo: '/reset-password',
      //   fetchOptions: {
      //     onSuccess: () => {
      //       const now = Date.now();
      //       const expiresAt = now + RPE_BLOCK_DURATION;
      //       localStorage.setItem(RPE_BLOCK_STORAGE_NAME, now.toString());
      //       setBlockedUntil(expiresAt);
      //       setTimeLeft(Math.ceil(RPE_BLOCK_DURATION / 1000));
      //       toast.success('Email inviata con successo!');
      //     },
      //     onError: (ctx) => {
      //       const code = ctx?.error?.code ?? 'UNKNOWN_ERROR';
      //       const message = getBetterAuthErrorMessage(code);
      //       toast.error(message);
      //     },
      //   },
      // });
    });
  };

  return (
    <Button
      onClick={onClickHandler}
      className='w-full mb-8'
      disabled={isPending || !!blockedUntil}
    >
      {isPending
        ? 'Invio email...'
        : blockedUntil
          ? `Invia nuovamente in ${timeLeft} secondi`
          : 'Invia nuovamente'}
    </Button>
  );
}
