'use client';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { EventStatus } from '@/lib/constants';
import { updateEventStatus } from '@/lib/server-actions/events/update-event-status';
import { Event } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

type UpdateEventStatusButtonProps = {
  event: Event;
  newStatus: EventStatus;
  buttonLabel: string;
  buttonVariant: 'link' | 'default' | 'success' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
  dialogTitle: string;
  dialogDescription: string;
  icon?: ReactNode;
};

export default function UpdateEventStatusButton({ event, newStatus, buttonLabel, buttonVariant, dialogTitle, dialogDescription, icon }: UpdateEventStatusButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

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
    setOpen(false);
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        size='sm'
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        {icon} {buttonLabel}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
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
