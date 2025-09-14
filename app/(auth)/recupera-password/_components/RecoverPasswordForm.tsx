'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { forgetPassword } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RPE_BLOCK_STORAGE_NAME, RPE_EMAIL_STORAGE_NAME } from '@/lib/constants';
import {
  recoverPasswordSchema,
  RecoverPasswordSchema,
} from '@/lib/validation/auth/recoverPasswordSchema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBetterAuthErrorMessage } from '@/lib/utils';

export default function RecoverPasswordForm() {
  const router = useRouter();
  const methods = useForm<RecoverPasswordSchema>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmitHandler = async (data: RecoverPasswordSchema) => {
    const { email } = data;

    await forgetPassword({
      email,
      redirectTo: '/reset-password',
      fetchOptions: {
        onSuccess: () => {
          localStorage.setItem(RPE_EMAIL_STORAGE_NAME, email);
          localStorage.setItem(RPE_BLOCK_STORAGE_NAME, Date.now().toString());
          router.push(`recupera-password/conferma-invio`);
        },
        onError: (ctx) => {
          const code = ctx?.error?.code ?? 'UNKNOWN_ERROR';
          const message = getBetterAuthErrorMessage(code);
          toast.error(message);
        },
      },
    });
  };

  return (
    <Card className='w-full max-w-xl max-h-max items-center p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardHeader className='w-full max-w-sm gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold mb-2'>Recupera password</CardTitle>
        <CardDescription className='text-xs md:text-sm'>
          Inserisci l&apos;indirizzo email associato al tuo account.
          <br />
          Ti invieremo un link per reimpostare la password.
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full max-w-sm p-0'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            className='p-2'
          >
            <div className='mb-8'>
              <div className='text-sm font-semibold mb-2'>Email</div>
              <Input
                id='email'
                type='email'
                placeholder='esempio@milanoovest.it'
                {...register('email')}
                className={errors.email ? 'border-destructive text-destructive' : ''}
                autoComplete='email'
              />
              {errors.email && (
                <p className='text-xs text-destructive mt-2'>{errors.email.message}</p>
              )}
            </div>
            <Button
              className='w-full mb-12'
              type='submit'
              variant='default'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Invio email...' : 'Conferma'}
            </Button>
          </form>
        </FormProvider>

        <Link
          href='/accedi'
          prefetch={false}
          className='flex justify-center items-center gap-0.5 text-sm text-muted-foreground'
        >
          <ArrowLeft className='size-4 text-muted-foreground' />
          Torna al login
        </Link>
      </CardContent>
    </Card>
  );
}
