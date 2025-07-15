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
import { Country, VenueManagerSelectData } from '@/lib/types';
import { useState } from 'react';
import CreateVenueForm from './CreateVenueForm/CreateVenueForm';

export default function CreateVenueButton({
  countries,
  venueManagers,
}: {
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
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
          Aggiungi locale
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[94dvh] sm:max-w-2xl grid grid-rows-[auto_1fr] pt-12'>
        <DialogTitle className='hidden'>
          Form per creazione nuovo locale
        </DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione del locale.
        </DialogDescription>

        <CreateVenueForm
          countries={countries}
          venueManagers={venueManagers}
          closeDialog={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
