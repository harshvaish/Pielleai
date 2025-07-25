'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { UserStatus } from '@/lib/constants';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { updateUserStatus } from '@/lib/server-actions/users/update-user-status';
import { CircleOff, Repeat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ToggleBlockButton({
  userId,
  userInitialStatus,
}: {
  userId: string;
  userInitialStatus: UserStatus;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const router = useRouter();

  const isActive = userInitialStatus === 'active';
  const title = isActive
    ? "Vuoi disattivare l'utente?"
    : "Vuoi riattivare l'utente?";
  const description = isActive
    ? "Sei sicuro di voler disattivare questo utente? L'utente non potrà più accedere."
    : "Sei sicuro di voler riattivare questo utente? L'utente potrà accedere di nuovo.";
  const confirmLabel = isActive ? 'Disattiva' : 'Riattiva';
  const btnVariant = isActive ? 'destructive' : 'default';

  const onDialogConfirm = () => {
    setIsDialogOpen(false);

    startTransition(async () => {
      const newStatus = userInitialStatus === 'active' ? 'disabled' : 'active';
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
        className={isActive ? 'text-destructive' : 'text-emerald-500'}
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
      >
        {isActive ? (
          <>
            <CircleOff className={isPending ? 'animate-spin' : ''} /> Disattiva
            utente
          </>
        ) : (
          <>
            <Repeat className={isPending ? 'animate-spin' : ''} /> Riattiva
            utente
          </>
        )}
      </Button>

      {isDesktop ? (
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
              <div className='flex justify-end gap-2 mt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isPending}
                >
                  Annulla
                </Button>
                <Button
                  variant={btnVariant}
                  size='sm'
                  onClick={onDialogConfirm}
                  disabled={isPending}
                >
                  {confirmLabel}
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DrawerContent>
            <DrawerHeader className='mb-20'>
              <DrawerTitle className='text-xl'>{title}</DrawerTitle>
              <DrawerDescription className='text-base'>
                {description}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className='grid grid-cols-2 gap-4'>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen(false)}
                disabled={isPending}
              >
                Annulla
              </Button>
              <Button
                variant={btnVariant}
                className='w-full'
                onClick={onDialogConfirm}
                disabled={isPending}
              >
                {confirmLabel}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
