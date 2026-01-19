'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArtistSelectData } from '@/lib/types';
import { useEffect, useState, useTransition } from 'react';
import { updateManagedArtists } from '@/lib/server-actions/artist-managers/update-managed-artists';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AVATAR_FALLBACK } from '@/lib/constants';
import { Users } from 'lucide-react';

type ManageArtistsButtonProps = {
  managerProfileId: number;
  artists: ArtistSelectData[];
  initialArtistIds: number[];
};

export default function ManageArtistsButton({
  managerProfileId,
  artists,
  initialArtistIds,
}: ManageArtistsButtonProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number[]>(initialArtistIds);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(initialArtistIds);
  }, [initialArtistIds]);

  const handleAddArtist = (artistId: string) => {
    const id = parseInt(artistId, 10);
    if (value.includes(id)) return;
    setValue((prev) => [...prev, id]);
  };

  const handleRemoveArtist = (artistId: number) => {
    setValue((prev) => prev.filter((id) => id !== artistId));
  };

  const onSave = () => {
    startTransition(async () => {
      const response = await updateManagedArtists(managerProfileId, value);
      if (response.success) {
        toast.success('Artisti gestiti aggiornati!');
        setOpen(false);
      } else {
        toast.error(response.message || 'Aggiornamento artisti gestiti non riuscito.');
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
          Associa / disassocia artisti
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-xl'>
        <DialogTitle>Gestione artisti</DialogTitle>
        <DialogDescription>
          Seleziona gli artisti da associare o rimuovere dalla gestione.
        </DialogDescription>

        <div className='flex flex-col gap-3'>
          <Select onValueChange={handleAddArtist}>
            <SelectTrigger size='sm'>Seleziona uno o piu&apos; artisti</SelectTrigger>
            <SelectContent>
              {artists.map((artist) => {
                const isSelected = value.includes(artist.id);
                const label = artist.stageName
                  ? `${artist.stageName}`
                  : `${artist.name} ${artist.surname}`;
                return (
                  <SelectItem
                    key={artist.id}
                    value={artist.id.toString()}
                    disabled={isSelected}
                  >
                    <div className='flex items-center gap-2 flex-nowrap'>
                      <Avatar className='w-6 h-6'>
                        <AvatarImage src={artist.avatarUrl || AVATAR_FALLBACK} />
                        <AvatarFallback>{artist.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {value.length > 0 && (
            <div className='w-full flex flex-nowrap gap-1 overflow-x-auto'>
              {value.map((artistId) => {
                const artist = artists.find((item) => item.id === artistId);
                if (!artist) return null;
                const label = artist.stageName
                  ? `${artist.stageName}`
                  : `${artist.name} ${artist.surname}`;
                return (
                  <Badge
                    key={artistId}
                    variant='outline'
                    className='group transition-colors hover:cursor-pointer hover:text-destructive hover:border-destructive'
                    onClick={() => handleRemoveArtist(artistId)}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
          )}

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
