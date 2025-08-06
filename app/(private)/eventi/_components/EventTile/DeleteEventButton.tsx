'use client';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { deleteEvent } from '@/lib/server-actions/events/delete-event';
import { EventTableData } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type DeleteEventButtonProps = {
  event: EventTableData;
};

export default function DeleteEventButton({ event }: DeleteEventButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const onConfirm = async () => {
    setLoading(true);
    const response = await deleteEvent(event.id);

    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success('Evento cancellato!');
    }

    router.refresh();
    setLoading(false);
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant='ghost'
        size='xs'
        className='text-destructive'
        onClick={() => setDialogOpen(true)}
        disabled={loading}
      >
        <Trash2 /> Elimina
      </Button>

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Sei sicuro di voler eliminare l'evento?"
        description="Attenzione: questa operazione è irreversibile. L'evento verrà eliminato definitivamente."
        confirmLabel='Elimina'
        cancelLabel='Annulla'
        onConfirm={onConfirm}
        isLoading={loading}
        loadingLabel='Aggiornamento...'
      />
    </>
  );
}
