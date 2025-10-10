'use client';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { signOut } from '@/lib/auth-client';
import { deleteUserAccount } from '@/lib/server-actions/users/delete-user-account';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function DeleteAccountTile() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onClickHandler = async () => {
    startTransition(async () => {
      const response = await deleteUserAccount();

      if (!response.success) {
        toast.error(response.message || 'Eliminazione account non riuscita.');
        return;
      }

      try {
        await signOut();
        router.replace('/accedi');
      } catch {
        toast.error('Disconnessione non riuscita, riprova più tardi.');
      }
    });
  };

  return (
    <>
      <div
        className='flex justify-between gap-4 px-2 py-3 rounded-md hover:bg-zinc-50 hover:cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <span className='text-sm font-semibold text-destructive'>
          {isPending ? 'Eliminazione...' : 'Elimina account'}
        </span>
        <Trash2 className='size-4 stroke-1 text-destructive' />
      </div>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title='Sei sicuro di voler eliminare il tuo account?'
        description='Questa azione è irreversibile e dovrai creare un nuovo account per accedere alla piattaforma.'
        onConfirm={onClickHandler}
        isLoading={isPending}
        confirmLabel='Elimina'
        cancelLabel='Annulla'
      />
    </>
  );
}
