'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArtistManagerSelectData } from '@/lib/types';
import { useEffect, useState, useTransition } from 'react';
import ArtistManagersSelect from '@/app/(private)/artisti/_components/create/ArtistManagersSelect';
import { updateArtistManagers } from '@/lib/server-actions/artists/update-artist-managers';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

type ManageArtistManagersButtonProps = {
  artistId: number;
  artistManagers: ArtistManagerSelectData[];
  initialManagerIds: number[];
};

export default function ManageArtistManagersButton({
  artistId,
  artistManagers,
  initialManagerIds,
}: ManageArtistManagersButtonProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number[]>(initialManagerIds);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(initialManagerIds);
  }, [initialManagerIds]);

  const onSave = () => {
    startTransition(async () => {
      const response = await updateArtistManagers(artistId, value);
      if (response.success) {
        toast.success('Manager aggiornati!');
        setOpen(false);
      } else {
        toast.error(response.message || 'Aggiornamento manager non riuscito.');
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      modal
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
        >
          <Users />
          Associa / disassocia manager
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-xl'>
        <DialogTitle>Gestione manager artista</DialogTitle>
        <DialogDescription>
          Seleziona uno o piu&apos; manager da associare o rimuovere.
        </DialogDescription>

        <div className='flex flex-col gap-3'>
          <ArtistManagersSelect
            artistManagers={artistManagers}
            value={value}
            onChange={setValue}
            hasError={false}
          />
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Annulla
            </Button>
            <Button
              type='button'
              onClick={onSave}
              disabled={isPending}
            >
              {isPending ? 'Salvataggio...' : 'Salva'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
