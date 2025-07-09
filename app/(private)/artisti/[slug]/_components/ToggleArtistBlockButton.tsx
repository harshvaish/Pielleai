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
import { toggleArtistStatus } from '@/lib/server-actions/artists/toggle-artist-status';
import { Clipboard, Repeat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ToggleArtistBlockButton({
  artistId,
  initialStatus,
}: {
  artistId: number;
  initialStatus: UserStatus;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const router = useRouter();

  const isActive = initialStatus === 'active';
  const title = isActive
    ? "Vuoi archiviare l'artista?"
    : "Vuoi riattivare l'artista?";
  const description = isActive
    ? "L'account verrà archiviato temporaneamente. Tutti i dati saranno conservati in modo sicuro e potrai riattivarlo in qualsiasi momento."
    : "Sei sicuro di voler riattivare questo artista? L'artista potrà essere nuovamente selezionato.";
  const confirmLabel = isActive ? 'Archivia' : 'Riattiva';
  const btnVariant = isActive ? 'destructive' : 'default';

  const onDialogConfirm = () => {
    setIsDialogOpen(false);

    startTransition(async () => {
      const response = await toggleArtistStatus(artistId, initialStatus);

      if (!response.success) {
        toast.error(response.message || 'Aggiornamento artista non riuscito.');
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
            <Clipboard className={isPending ? 'animate-spin' : ''} /> Archivia
            artista
          </>
        ) : (
          <>
            <Repeat className={isPending ? 'animate-spin' : ''} /> Riattiva
            artista
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
