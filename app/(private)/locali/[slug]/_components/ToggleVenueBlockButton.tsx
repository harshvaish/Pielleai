'use client';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { UserStatus } from '@/lib/constants';
import { toggleVenueStatus } from '@/lib/server-actions/venues/toggle-venue-status';
import { cn } from '@/lib/utils';
import { Clipboard, Repeat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ToggleVenueBlockButton({
  venueId,
  initialStatus,
}: {
  venueId: number;
  initialStatus: UserStatus;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isActive = initialStatus === 'active';
  const title = isActive
    ? 'Vuoi archiviare il locale?'
    : 'Vuoi riattivare il locale?';
  const description = isActive
    ? 'Il locale verrà archiviato temporaneamente. Tutti i dati saranno conservati in modo sicuro e potrai riattivarlo in qualsiasi momento.'
    : 'Sei sicuro di voler riattivare questo locale? Il locale potrà essere di nuovo selezionato per gli eventi.';
  const confirmLabel = isActive ? 'Archivia' : 'Riattiva';

  const onConfirm = () => {
    setIsDialogOpen(false);
    startTransition(async () => {
      const response = await toggleVenueStatus(venueId, initialStatus);

      if (!response.success) {
        toast.error(response.message || 'Aggiornamento locale non riuscito.');
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
        className={cn(
          'max-w-max',
          isActive ? 'text-destructive' : 'text-emerald-500'
        )}
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
      >
        {isActive ? (
          <>
            <Clipboard className={isPending ? 'animate-spin' : ''} /> Archivia
            locale
          </>
        ) : (
          <>
            <Repeat className={isPending ? 'animate-spin' : ''} /> Riattiva
            locale
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
        onConfirm={onConfirm}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
}
