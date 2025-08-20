'use client';

import { Button } from '@/components/ui/button';
import { Clipboard, Repeat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { toggleArtistStatus } from '@/lib/server-actions/artists/toggle-artist-status';
import { UserStatus } from '@/lib/constants';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { cn } from '@/lib/utils';

type ToggleArtistBlockButtonProps = {
  artistId: number;
  initialStatus: UserStatus;
};

export default function ToggleArtistBlockButton({ artistId, initialStatus }: ToggleArtistBlockButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isActive = initialStatus === 'active';
  const title = isActive ? "Vuoi archiviare l'artista?" : "Vuoi riattivare l'artista?";
  const description = isActive
    ? "L'account verrà archiviato temporaneamente. Tutti i dati saranno conservati in modo sicuro e potrai riattivarlo in qualsiasi momento."
    : "Sei sicuro di voler riattivare questo artista? L'artista potrà essere nuovamente selezionato.";
  const confirmLabel = isActive ? 'Archivia' : 'Riattiva';

  const onDialogConfirm = () => {
    startTransition(async () => {
      const response = await toggleArtistStatus(artistId, initialStatus);

      if (!response.success) {
        toast.error(response.message || 'Aggiornamento artista non riuscito.');
        return;
      }
      setIsDialogOpen(false);
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
            <Clipboard className={isPending ? 'animate-spin' : ''} />
            Archivia artista
          </>
        ) : (
          <>
            <Repeat className={isPending ? 'animate-spin' : ''} />
            Riattiva artista
          </>
        )}
      </Button>

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel='Annulla'
        isLoading={isPending}
        onConfirm={onDialogConfirm}
      />
    </>
  );
}
