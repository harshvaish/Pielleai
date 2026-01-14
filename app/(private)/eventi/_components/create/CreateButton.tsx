'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { Plus } from 'lucide-react';
import { ArtistSelectData, MoCoordinator, UserRole, VenueSelectData } from '@/lib/types';
import { useState } from 'react';
import CreateEventForm from './CreateEventForm';
import CreateEventRequestForm from './CreateEventRequestForm';

type CreateButtonProps = {
  userRole: UserRole;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  buttonLabel?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonSize?: VariantProps<typeof buttonVariants>['size'];
};

export default function CreateButton({
  userRole,
  artists,
  venues,
  moCoordinators,
  buttonLabel = 'Aggiungi',
  buttonVariant,
  buttonSize = 'sm',
}: CreateButtonProps) {
  const [open, setOpen] = useState<boolean>(false);

  const isAdmin = userRole === 'admin';

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
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
        <DialogTitle className='hidden'>Form per creazione nuovo evento</DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione dell&apos;evento.
        </DialogDescription>

        {isAdmin ? (
          <CreateEventForm
            artists={artists}
            venues={venues}
            moCoordinators={moCoordinators}
            userRole={userRole}
            closeDialog={() => setOpen(false)}
          />
        ) : (
          <CreateEventRequestForm
            artists={artists}
            venues={venues}
            userRole={userRole}
            closeDialog={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
