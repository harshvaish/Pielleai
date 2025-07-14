'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Country, Language, VenueManagerData } from '@/lib/types';
import { useState } from 'react';
import PersonalDataForm from './EditVenueManagerForm/PersonalDataForm';

export default function EditVenueManagerButton({
  userData,
  languages,
  countries,
}: {
  userData: VenueManagerData;
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
        <Button variant='ghost'>
          <Pencil />
          Modifica
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[94dvh] sm:max-w-2xl grid grid-rows-[auto_1fr]'>
        <DialogTitle className='hidden'>
          Form per modifica dati promoter locali
        </DialogTitle>
        <DialogDescription className='hidden'>
          Effettua le modifiche necessarie al mantenimento del profilo
          aggiornato.
        </DialogDescription>

        <section className='max-h-full overflow-y-auto pt-4'>
          <PersonalDataForm
            userData={userData}
            languages={languages}
            countries={countries}
            closeDialog={() => setIsDialogOpen(false)}
          />
        </section>
      </DialogContent>
    </Dialog>
  );
}
