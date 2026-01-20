'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ArtistManagerSelectData } from '@/lib/types';
import { createArtistManager } from '@/lib/server-actions/artist-managers/create-artist-manager';

type QuickCreateArtistManagerDialogProps = {
  onCreated: (manager: ArtistManagerSelectData) => void;
};

export default function QuickCreateArtistManagerDialog({
  onCreated,
}: QuickCreateArtistManagerDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setName('');
    setSurname('');
  };

  const onSubmit = () => {
    startTransition(async () => {
      const response = await createArtistManager({
        name,
        surname,
      });

      if (response.success) {
        onCreated(response.data);
        toast.success('Manager artista creato!');
        resetForm();
        setOpen(false);
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          type='button'
          size='xs'
          variant='ghost'
          className='h-6 px-2 text-xs'
        >
          <Plus className='size-3' />
          Crea nuovo
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogTitle>Nuovo manager artista</DialogTitle>
        <div className='grid gap-3'>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              placeholder='Nome *'
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              placeholder='Cognome'
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              size='sm'
              variant='ghost'
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Annulla
            </Button>
            <Button
              type='button'
              size='sm'
              onClick={onSubmit}
              disabled={isPending}
            >
              {isPending ? 'Creo...' : 'Crea'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
