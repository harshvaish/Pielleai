'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from '@/lib/validation/auth/resetPasswordSchema';
import { resetPassword } from '@/lib/auth-client';
import InputPassword from '@/app/_components/InputPassword';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { getBetterAuthErrorMessage } from '@/lib/utils';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const methods = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = methods;

  const onSubmit = async (data: ResetPasswordSchema) => {
    await resetPassword({
      newPassword: data.password,
      token,
      fetchOptions: {
        onSuccess: () => {
          toast.success('Password Resetta!');
          setTimeout(() => router.replace('/accedi'), 3000);
        },
        onError: (ctx) => {
          const code = ctx?.error?.code ?? 'UNKNOWN_ERROR';
          const message = getBetterAuthErrorMessage(code);
          toast.error(message);
        },
      },
    });
  };

  const hasInput = !!watch('password') || !!watch('confirmPassword');

  const openModal = () => {
    if (hasInput) {
      setIsDialogOpen(true);
    } else {
      router.replace('/accedi');
    }
  };

  return (
    <>
      <Card className='w-full max-w-xl max-h-max items-center p-6 md:p-8 rounded-2xl'>
        <CardHeader className='w-full max-w-sm gap-0 text-center p-0'>
          <CardTitle className='text-2xl font-semibold mb-2'>Reset password</CardTitle>
          <CardDescription className='text-xs md:text-sm'>
            Crea una password sicura per proteggere il tuo account
          </CardDescription>
        </CardHeader>

        <CardContent className='w-full max-w-sm p-0'>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className='mb-4'>
                <div className='text-sm font-semibold mb-2'>Nuova password</div>
                <InputPassword
                  id='password'
                  {...register('password')}
                  error={!!errors.password}
                />
                {errors.password && (
                  <p className='text-xs text-destructive mt-2'>{errors.password.message}</p>
                )}
              </div>

              <div className='mb-8'>
                <div className='text-sm font-semibold mb-2'>Conferma nuova password</div>
                <InputPassword
                  id='confirmPassword'
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <p className='text-xs text-destructive mt-2'>{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                className='w-full mb-4'
                type='submit'
                variant='default'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Reset password...' : 'Reset password'}
              </Button>
            </form>
          </FormProvider>

          <div className='flex justify-center'>
            <Button
              className='text-sm text-zinc-600 font-medium'
              variant='ghost'
              onClick={openModal}
            >
              <ArrowLeft className='size-4 text-muted-foreground' />
              Torna al login
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title='Sei sicuro di voler uscire?'
        description='Il processo verrà interrotto e i dati verranno persi.'
        confirmLabel='Esci'
        cancelLabel='Rimani'
        onConfirm={() => router.replace('/accedi')}
      />
    </>
  );
}
