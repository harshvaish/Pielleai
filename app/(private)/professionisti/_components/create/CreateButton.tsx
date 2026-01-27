'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VariantProps } from 'class-variance-authority';
import CreateProfessionalForm from './CreateProfessionalForm';

type CreateButtonProps = {
  buttonLabel?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonSize?: VariantProps<typeof buttonVariants>['size'];
};

export default function CreateButton({
  buttonLabel = 'Aggiungi',
  buttonVariant,
  buttonSize = 'xs',
}: CreateButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        <DialogTitle className='hidden'>Form per creazione nuovo professionista</DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione del profilo.
        </DialogDescription>

        <CreateProfessionalForm closeDialog={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
