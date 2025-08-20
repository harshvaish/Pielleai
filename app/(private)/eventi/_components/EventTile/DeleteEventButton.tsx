'use client';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { deleteEvent } from '@/lib/server-actions/events/delete-event';
import { Event } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type DeleteEventButtonProps = {
  event: Event;
};

export default function DeleteEventButton({ event }: DeleteEventButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

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
    setOpen(false);
  };

  return (
    <>
      <Button
        variant='ghost'
        size='xs'
        className='text-destructive'
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Trash2 /> Elimina
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
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
