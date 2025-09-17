'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import InputPassword from '../InputPassword';
import {
  ChangePasswordSchema,
  changePasswordSchema,
} from '@/lib/validation/change-password-schema';
import { signIn } from '@/lib/auth-client';
import { updateUserPassword } from '@/lib/server-actions/users/update-user-password';
import { useTransition } from 'react';

type ChangePasswordFormProps = {
  userId: string;
  email: string;
  closeDialog: () => void;
};

export default function ChangePasswordForm({
  userId,
  email,
  closeDialog,
}: ChangePasswordFormProps) {
  const [isPending, startTransition] = useTransition();

  const methods = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {},
  });

  const {
    register,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: ChangePasswordSchema) => {
    if (!email) {
      toast.error('Utente non autenticato');
      return;
    }

    startTransition(async () => {
      // Step 1: Validate old password
      const signInResponse = await signIn.email({
        email: email,
        password: data.oldPassword,
      });

      if (signInResponse.error) {
        toast.error('La vecchia password non è corretta.');
        return;
      }

      // Step 2: Change password
      const updateResponse = await updateUserPassword(userId, data.newPassword);

      if (updateResponse.success) {
        toast.success('Password aggiornata con successo!');
        closeDialog();
      } else {
        toast.error(updateResponse.message || "Errore durante l'aggiornamento.");
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4 p-2'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Vecchia password</div>
          <InputPassword
            {...register('oldPassword')}
            error={!!errors.oldPassword}
          />
          {errors.oldPassword && (
            <p className='text-xs text-destructive mt-2'>{errors.oldPassword.message as string}</p>
          )}
        </div>

        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Nuova password</div>
          <InputPassword
            {...register('newPassword')}
            error={!!errors.newPassword}
          />
          {errors.newPassword && (
            <p className='text-xs text-destructive mt-2'>{errors.newPassword.message as string}</p>
          )}
        </div>

        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Conferma nuova password</div>
          <InputPassword
            {...register('newPasswordConfirm')}
            error={!!errors.newPasswordConfirm}
          />
          {errors.newPasswordConfirm && (
            <p className='text-xs text-destructive mt-2'>
              {errors.newPasswordConfirm.message as string}
            </p>
          )}
        </div>

        <div className='grid grid-cols-2 md:flex justify-end gap-4 mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
            variant='outline'
            disabled={isPending}
          >
            Annulla
          </Button>

          <Button
            type='submit'
            disabled={isPending}
          >
            {isPending ? 'Salvataggio...' : 'Conferma'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
