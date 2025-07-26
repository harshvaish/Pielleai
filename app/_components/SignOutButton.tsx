'use client';

import { signOut } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { SpinnerLoading } from './SpinnerLoading';
import ConfirmDialog from './ConfirmDialog';

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClickHandler = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.replace('/accedi');
    } catch (error) {
      console.error(error);
      toast.error('Disconnessione non riuscita, riprova più tardi.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className='flex items-center gap-2 text-sm text-destructive font-medium p-2 transition-colors rounded-md hover:bg-zinc-50 hover:cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        {isLoading ? (
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
        description="Per procedere con l'app sarà necessario effettuare nuovamente il login."
        onConfirm={onClickHandler}
        isLoading={isLoading}
        confirmLabel='Esci'
        cancelLabel='Rimani'
      />
    </>
  );
}
