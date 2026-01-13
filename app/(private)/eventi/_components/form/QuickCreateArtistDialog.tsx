'use client';

import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ArtistSelectData } from '@/lib/types';
import { createArtist } from '@/lib/server-actions/artists/create-artist';

type QuickCreateArtistDialogProps = {
  onCreated: (artist: ArtistSelectData) => void;
};

export default function QuickCreateArtistDialog({ onCreated }: QuickCreateArtistDialogProps) {
  const [open, setOpen] = useState(false);
  const [stageName, setStageName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isPending, startTransition] = useTransition();
  const sanitizedName = useMemo(() => name.replace(/[^\\p{L}\\s'-]/gu, '').trim(), [name]);
  const sanitizedSurname = useMemo(() => surname.replace(/[^\\p{L}\\s'-]/gu, '').trim(), [surname]);

  const resetForm = () => {
    setStageName('');
    setName('');
    setSurname('');
  };

  const onSubmit = () => {
    if (!stageName.trim()) {
      toast.error("Inserisci il nome d'arte.");
      return;
    }

    startTransition(async () => {
      const response = await createArtist({
        stageName: stageName.trim(),
        name: sanitizedName,
        surname: sanitizedSurname,
        taxableInvoice: undefined
      });

      if (response.success) {
        onCreated(response.data);
        toast.success('Artista creato!');
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
        <DialogTitle>Nuovo artista</DialogTitle>
        <div className='grid gap-3'>
          <Input
            placeholder="Nome d'arte *"
            value={stageName}
            onChange={(event) => setStageName(event.target.value)}
          />
          <div className='grid grid-cols-2 gap-2'>
            <Input
              placeholder='Nome'
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
