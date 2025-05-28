'use client';

import { Button } from '@/components/ui/button';
import { forgetPassword } from '@/lib/auth-client';
import { RPE_BLOCK_DURATION, RPE_BLOCK_STORAGE_NAME } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

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

  const onClickHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const validation = z
        .string()
        .min(1, 'Email obbligatoria')
        .email('Formato non valido')
        .safeParse(email);

      if (!validation.success) {
        toast.error('Email non trovata o malformata, riprova più tardi');
        setIsLoading(false);
        return;
      }

      await forgetPassword({
        email,
        redirectTo: '/cambia-password',
        fetchOptions: {
          onError: () => {
            toast.error('Invio email non riuscito, riprova più tardi');
          },
          onSuccess: () => {
            const now = Date.now();
            const expiresAt = now + RPE_BLOCK_DURATION;
            localStorage.setItem(RPE_BLOCK_STORAGE_NAME, now.toString());
            setBlockedUntil(expiresAt);
            setTimeLeft(Math.ceil(RPE_BLOCK_DURATION / 1000));
            toast.success('Email inviata con successo!');
          },
        },
      });
    } catch (error) {
      console.error('Error: ', error instanceof Error ? error.message : error);
      toast.error("Invio email non riuscito, per favore contatta l'assistenza");
    } finally {
      setIsLoading(false);
    }
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
