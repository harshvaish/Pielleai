'use client';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { EventStatus } from '@/lib/constants';
import { updateEventStatus } from '@/lib/server-actions/events/update-event-status';
import { Event } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type UpdateEventStatusButtonProps = {
  event: Event;
  newStatus: EventStatus;
  buttonLabel: string;
  buttonVariant: 'link' | 'default' | 'success' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
  dialogTitle: string;
  dialogDescription: string;
};

export default function UpdateEventStatusButton({ event, newStatus, buttonLabel, buttonVariant, dialogTitle, dialogDescription }: UpdateEventStatusButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const onConfirm = async () => {
    setLoading(true);
    const response = await updateEventStatus(event.id, newStatus);

    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success('Stato evento aggiornato!');
    }

    router.refresh();
    setLoading(false);
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        size='sm'
        onClick={() => setDialogOpen(true)}
        disabled={loading}
      >
        {buttonLabel}
      </Button>

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogTitle}
        description={dialogDescription}
        confirmLabel={buttonLabel}
        cancelLabel='Annulla'
        onConfirm={onConfirm}
        isLoading={loading}
        loadingLabel='Aggiornamento...'
        confirmButtonVariant={buttonVariant}
      />
    </>
  );
}
