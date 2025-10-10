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
import { ArtistManagerSelectData, Country, Language, UserRole, Zone } from '@/lib/types';
import { useState } from 'react';
import CreateArtistForm from './CreateArtistForm';

type CreateButtonProps = {
  userRole: UserRole;
  userProfileId: number;
  languages: Language[];
  countries: Country[];
  zones: Zone[];
  artistManagers: ArtistManagerSelectData[];
};

export default function CreateButton({
  userRole,
  userProfileId,
  languages,
  countries,
  zones,
  artistManagers,
}: CreateButtonProps) {
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
        <DialogTitle className='hidden'>Form per creazione nuovo artista</DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione del profilo.
        </DialogDescription>

        <CreateArtistForm
          userRole={userRole}
          userProfileId={userProfileId}
          languages={languages}
          countries={countries}
          zones={zones}
          artistManagers={artistManagers}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
