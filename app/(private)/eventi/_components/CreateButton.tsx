'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ArtistSelectData, VenueSelectData } from '@/lib/types';
import { useState } from 'react';
import CreateEventForm from './CreateEventForm/CreateEventForm';

export default function CreateButton({
  artists,
  venues,
}: {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      modal
    >
      <DialogTrigger asChild>
        <Button size='sm'>
          <Plus />
          Aggiungi
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[94dvh] sm:max-w-2xl grid grid-rows-[auto_1fr] pt-12'>
        <DialogTitle className='hidden'>
          Form per creazione nuovo evento
        </DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione dell&apos;evento.
        </DialogDescription>

        <CreateEventForm
          artists={artists}
          venues={venues}
          closeDialog={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
