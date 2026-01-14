'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { Country, Language } from '@/lib/types';
import { useState } from 'react';
import CreateArtistManagerForm from './CreateArtistManagerForm';
import { VariantProps } from 'class-variance-authority';

export default function CreateButton({
  languages,
  countries,
  buttonLabel = 'Aggiungi',
  buttonVariant,
  buttonSize = 'sm',
}: {
  languages: Language[];
  countries: Country[];
  buttonLabel?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonSize?: VariantProps<typeof buttonVariants>['size'];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      modal
    >
      <DialogTrigger asChild>
        <Button
          size={buttonSize}
          variant={buttonVariant}
        >
          <Plus />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className='h-dvh md:max-h-[94dvh] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'
      >
        <DialogTitle className='hidden'>Form per creazione nuovo manager artista</DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione del profilo.
        </DialogDescription>

        <CreateArtistManagerForm
          languages={languages}
          countries={countries}
          closeDialog={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
