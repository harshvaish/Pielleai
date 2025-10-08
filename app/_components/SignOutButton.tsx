'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { SpinnerLoading } from './SpinnerLoading';
import ConfirmDialog from './ConfirmDialog';
import { signOut } from '@/lib/server-actions/auth/sign-out';

export default function SignOutButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onClickHandler = async () => {
    startTransition(async () => {
      const response = await signOut();

      if (!response.success) {
        toast.error(response.message || 'Disconnessione non riuscita, riprova più tardi.');
        return;
      }

      startTransition(() => router.replace('/accedi'));
    });
  };

  return (
    <>
      <div
        className='flex items-center gap-2 text-sm text-destructive font-medium p-2 transition-colors rounded-md hover:bg-zinc-50 hover:cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        {isPending ? (
          <>
            <SpinnerLoading className='size-3' /> Uscita
          </>
        ) : (
          <>
            <LogOut className='size-3' /> Esci
          </>
        )}
      </div>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title='Sei sicuro di voler uscire?'
        description="Per procedere con l'utilizzo dell'app sarà necessario effettuare nuovamente il login."
        onConfirm={onClickHandler}
        isLoading={isPending}
        confirmLabel='Esci'
        cancelLabel='Rimani'
      />
    </>
  );
}
