'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ArtistSelectData, Event, MoCoordinator, VenueSelectData } from '@/lib/types';
import { useState } from 'react';
import UpdateEventForm from './UpdateEventForm';

type UpdateEventButtonProps = {
  event: Event;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
};

export default function UpdateEventButton({ event, artists, venues, moCoordinators }: UpdateEventButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      modal
    >
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='xs'
        >
          <Pencil /> Modifica
        </Button>
      </DialogTrigger>
      <DialogContent className='h-dvh md:max-h-[94dvh] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'>
        <DialogTitle className='hidden'>Form per aggiornamento evento</DialogTitle>
        <DialogDescription className='hidden'>Modifica i dell&apos;evento.</DialogDescription>

        <UpdateEventForm
          event={event}
          artists={artists}
          venues={venues}
          moCoordinators={moCoordinators}
          closeDialog={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
