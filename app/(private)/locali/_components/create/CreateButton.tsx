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
import { Country, UserRole, VenueManagerSelectData } from '@/lib/types';
import { useState } from 'react';
import CreateVenueForm from './CreateVenueForm';
import { VariantProps } from 'class-variance-authority';

type CreateButtonProps = {
  userRole: UserRole;
  userProfileId: number;
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
  buttonLabel?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonSize?: VariantProps<typeof buttonVariants>['size'];
};

export default function CreateButton({
  userRole,
  userProfileId,
  countries,
  venueManagers,
  buttonLabel = 'Aggiungi',
  buttonVariant,
  buttonSize = 'sm',
}: CreateButtonProps) {
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
        <DialogTitle className='hidden'>Form per creazione nuovo locale</DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione del locale.
        </DialogDescription>

        <CreateVenueForm
          userRole={userRole}
          userProfileId={userProfileId}
          countries={countries}
          venueManagers={venueManagers}
          closeDialog={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
