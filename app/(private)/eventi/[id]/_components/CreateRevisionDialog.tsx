'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createEventRevision } from '@/lib/server-actions/events/create-event-revision';

type CreateRevisionDialogProps = {
  eventId: number;
};

export default function CreateRevisionDialog({ eventId }: CreateRevisionDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!reason.trim() || !description.trim()) {
      toast.error('Motivo e descrizione sono obbligatori.');
      return;
    }

    startTransition(async () => {
      const response = await createEventRevision(eventId, reason.trim(), description.trim());
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success('Revisione creata.');
      setOpen(false);
      router.push(`/eventi/${response.data.eventId}/modifica`);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary'>Crea revisione</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova revisione</DialogTitle>
          <DialogDescription>
            Inserisci il motivo e la descrizione della modifica. Verra creato un nuovo
            evento revisionato basato sull&apos;ultima versione.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Motivo revisione</label>
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder='Es. correzione dati finanziari'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Descrizione modifiche</label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder='Dettaglia cosa verra aggiornato.'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='ghost' onClick={() => setOpen(false)} disabled={isPending}>
            Annulla
          </Button>
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? 'Creazione...' : 'Crea revisione'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
