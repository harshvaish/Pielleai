'use client';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { signOut } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function SignOutTile() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onClickHandler = async () => {
    startTransition(async () => {
      try {
        await signOut();
        router.replace('/accedi');
      } catch (error) {
        console.error(error);
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
        <span className='text-sm font-semibold text-zinc-600'>
          {isPending ? 'Uscita...' : 'Esci'}
        </span>
        <LogOut className='size-4 stroke-1 text-zinc-700' />
      </div>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title='Sei sicuro di voler uscire?'
        description="Per procedere con l'app sarà necessario effettuare nuovamente il login."
        onConfirm={onClickHandler}
        isLoading={isPending}
        confirmLabel='Esci'
        cancelLabel='Rimani'
      />
    </>
  );
}
