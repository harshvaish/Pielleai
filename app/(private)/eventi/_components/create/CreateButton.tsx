'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ArtistSelectData, MoCoordinator, VenueSelectData } from '@/lib/types';
import { useState } from 'react';
import CreateEventForm from './CreateEventForm';

export default function CreateButton({ artists, venues, moCoordinators }: { artists: ArtistSelectData[]; venues: VenueSelectData[]; moCoordinators: MoCoordinator[] }) {
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
      <DialogContent className='h-dvh md:max-h-[94dvh] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'>
        <DialogTitle className='hidden'>Form per creazione nuovo evento</DialogTitle>
        <DialogDescription className='hidden'>Inserisci tutti i dati necessari alla creazione dell&apos;evento.</DialogDescription>

        <CreateEventForm
          artists={artists}
          venues={venues}
          moCoordinators={moCoordinators}
          closeDialog={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
