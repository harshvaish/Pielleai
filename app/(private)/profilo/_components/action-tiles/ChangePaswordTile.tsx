'use client';

import ChangePasswordForm from '@/app/_components/ChangePassword/ChangePasswordForm';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Lock } from 'lucide-react';
import { useState } from 'react';

type ChangePasswordButton = {
  userId: string;
  email: string;
};

export default function ChangePasswordTile({ userId, email }: ChangePasswordButton) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className='flex justify-between gap-4 px-2 py-3 rounded-md hover:bg-zinc-50 hover:cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <span className='text-sm font-semibold text-zinc-600'>Cambia Password</span>
        <Lock className='size-4 stroke-1 text-zinc-700' />
      </div>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title='Cambio password'
        description='Inserisci la vecchia e la nuova password per aggiornare le credenziali.'
      >
        <ChangePasswordForm
          userId={userId}
          email={email}
          closeDialog={() => setIsOpen(false)}
        />
      </ConfirmDialog>
    </>
  );
}
