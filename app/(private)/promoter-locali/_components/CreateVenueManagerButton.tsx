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
import { Country, Language } from '@/lib/types';
import { useState } from 'react';
import CreateVenueManagerForm from './CreateVenueManagerForm/CreateVenueManagerForm';

export default function CreateVenueManagerButton({
  languages,
  countries,
}: {
  languages: Language[];
  countries: Country[];
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
          Aggiungi promoter locali
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[94dvh] sm:max-w-2xl grid grid-rows-[auto_1fr] pt-12'>
        <DialogTitle className='hidden'>
          Form per creazione nuovo promoter locali
        </DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione del profilo.
        </DialogDescription>

        <CreateVenueManagerForm
          languages={languages}
          countries={countries}
          closeDialog={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
