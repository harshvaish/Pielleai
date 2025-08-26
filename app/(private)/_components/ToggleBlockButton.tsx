'use client';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { updateUserStatus } from '@/lib/server-actions/users/update-user-status';
import { UserStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircleOff, Repeat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ToggleBlockButton({ userId, userInitialStatus }: { userId: string; userInitialStatus: UserStatus }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isActive = userInitialStatus === 'active';
  const title = isActive ? "Vuoi disattivare l'utente?" : "Vuoi riattivare l'utente?";
  const description = isActive ? "Sei sicuro di voler disattivare questo utente? L'utente non potrà più accedere." : "Sei sicuro di voler riattivare questo utente? L'utente potrà accedere di nuovo.";
  const confirmLabel = isActive ? 'Disattiva' : 'Riattiva';

  const onConfirm = () => {
    setIsDialogOpen(false);

    startTransition(async () => {
      const newStatus = isActive ? 'disabled' : 'active';
      const response = await updateUserStatus(userId, newStatus);
      if (!response.success) {
        toast.error(response.message || 'Aggiornamento utente non riuscito.');
        return;
      }
      router.refresh();
    });
  };

  return (
    <>
      <Button
        variant='ghost'
        size='sm'
        className={cn('max-w-max', isActive ? 'text-destructive' : 'text-emerald-500')}
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
      >
        {isActive ? (
          <>
            <CircleOff className={isPending ? 'animate-spin' : ''} /> Disattiva utente
          </>
        ) : (
          <>
            <Repeat className={isPending ? 'animate-spin' : ''} /> Riattiva utente
          </>
        )}
      </Button>

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={title}
        description={description}
        onConfirm={onConfirm}
        onCancel={() => setIsDialogOpen(false)}
        confirmLabel={confirmLabel}
        cancelLabel='Annulla'
        loadingLabel='Attendere...'
        isLoading={isPending}
      />
    </>
  );
}
