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
import CreateVenueManagerForm from './CreateVenueManagerForm';

type CreateButtonProps = {
  languages: Language[];
  countries: Country[];
};

export default function CreateButton({ languages, countries }: CreateButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      modal
    >
      <DialogTrigger asChild>
        <Button size='sm'>
          <Plus />
          Aggiungi
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className='h-dvh md:max-h-[94dvh] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'
      >
        <DialogTitle className='hidden'>Form per creazione nuovo promoter locali</DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione del profilo.
        </DialogDescription>

        <CreateVenueManagerForm
          languages={languages}
          countries={countries}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
