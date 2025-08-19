'use client';

import { Lock } from 'lucide-react';
import { useState } from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import ConfirmDialog from '../ConfirmDialog';

type ChangePasswordButton = {
  userId: string;
  email: string;
};

export default function ChangePasswordButton({ userId, email }: ChangePasswordButton) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className='flex items-center gap-2 text-sm text-zinc-700 font-medium p-2 transition-colors rounded-md hover:bg-zinc-50 hover:cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <Lock className='size-3' /> Cambia password
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
