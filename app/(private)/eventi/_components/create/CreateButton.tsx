'use client';

import Link from 'next/link';
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
import { useState } from 'react';
import { ArtistSelectData, MoCoordinator, UserRole, VenueSelectData } from '@/lib/types';
import CreateEventForm from './CreateEventForm';
import CreateEventRequestForm from './CreateEventRequestForm';

type CreateButtonProps = {
  userRole?: UserRole;
  artists?: ArtistSelectData[];
  venues?: VenueSelectData[];
  moCoordinators?: MoCoordinator[];
  forceLink?: boolean;
  buttonLabel?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonSize?: VariantProps<typeof buttonVariants>['size'];
};

export default function CreateButton({
  userRole,
  artists,
  venues,
  moCoordinators,
  forceLink = false,
  buttonLabel = 'Aggiungi',
  buttonVariant,
  buttonSize = 'xs',
}: CreateButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (
    forceLink ||
    !userRole ||
    !artists ||
    !venues ||
    (userRole === 'admin' && !moCoordinators)
  ) {
    return (
      <Button
        asChild
        size={buttonSize}
        variant={buttonVariant}
      >
        <Link href='/eventi/crea'>
          <Plus />
          {buttonLabel}
        </Link>
      </Button>
    );
  }

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
        <DialogTitle className='hidden'>Form per creazione nuovo evento</DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione dell&#39;evento.
        </DialogDescription>

        {userRole === 'admin' ? (
          <CreateEventForm
            artists={artists!}
            venues={venues!}
            moCoordinators={moCoordinators!}
            userRole={userRole}
            closeDialog={() => setIsDialogOpen(false)}
          />
        ) : (
          <CreateEventRequestForm
            artists={artists!}
            venues={venues!}
            userRole={userRole}
            closeDialog={() => setIsDialogOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
