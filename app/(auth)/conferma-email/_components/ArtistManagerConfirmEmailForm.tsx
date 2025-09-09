'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/_components/BackButton';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useEffect, useState, useTransition } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CE_EMAIL_STORAGE_NAME } from '@/lib/constants';
import { emailValidation, getZodErrors, otpValidation } from '@/lib/validation/_general';
import { CardDescription } from '@/components/ui/card';
import { emailOtp } from '@/lib/auth-client';
import { toast } from 'sonner';
import { getBetterAuthOTPErrorMessage } from '@/lib/utils';
import ButtonResendOTP from './ButtonResendOTP';

export default function ArtistManagerConfirmEmailForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const onClickHandler = async () => {
    setError(null);
    const validation = otpValidation.safeParse(code);

    if (!validation.success) {
      const validationErrors = getZodErrors(validation.error);
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
      }
      return;
    }

    startTransition(async () => {
      const { data, error } = await emailOtp.verifyEmail({
        email: email,
        otp: code,
      });

      if (error) {
        const message = getBetterAuthOTPErrorMessage(error?.code || '');

        toast.error(message);
        return;
      }

      if (data.user.emailVerified) {
        router.push('/accedi');
        return;
      }

      toast.error('Verifica email non riuscita, riprova.');
    });
  };

  useEffect(() => {
    const email = localStorage.getItem(CE_EMAIL_STORAGE_NAME);

    if (!email) {
      router.replace('/registrati/manager-artisti');
      return;
    }

    const validation = emailValidation.safeParse(email);

    if (!validation.success) {
      localStorage.removeItem(CE_EMAIL_STORAGE_NAME);
      router.replace('/registrati/manager-artisti');
    }

    setEmail(email);
  }, []);

  return (
    <div className='flex flex-col items-center gap-4'>
      <div>
        <div className='text-sm text-center font-semibold mb-2'>Codice OTP</div>
        <InputOTP
          name='otp'
          maxLength={6}
          value={code}
          onChange={(value) => setCode(value)}
          pattern={REGEXP_ONLY_DIGITS}
        >
          <InputOTPGroup>
            <InputOTPSlot
              index={0}
              aria-invalid={!!error}
            />
            <InputOTPSlot
              index={1}
              aria-invalid={!!error}
            />
            <InputOTPSlot
              index={2}
              aria-invalid={!!error}
            />
            <InputOTPSlot
              index={3}
              aria-invalid={!!error}
            />
            <InputOTPSlot
              index={4}
              aria-invalid={!!error}
            />
            <InputOTPSlot
              index={5}
              aria-invalid={!!error}
            />
          </InputOTPGroup>
        </InputOTP>
        {error && <p className='text-xs text-destructive mt-2'>{error}</p>}
      </div>

      <CardDescription className='text-xs md:text-sm text-center'>
        Ti abbiamo inviato una email contentente il codice all&apos;indirizzo:
        <br />
        <strong>{email}</strong>
      </CardDescription>

      <Button
        className='w-full'
        type='submit'
        disabled={isPending}
        onClick={onClickHandler}
      >
        {isPending ? 'Verifico...' : 'Verifica'}
      </Button>

      <div className='w-full flex justify-between items-center gap-4'>
        <BackButton />
        <ButtonResendOTP email={email} />
      </div>
    </div>
  );
}
