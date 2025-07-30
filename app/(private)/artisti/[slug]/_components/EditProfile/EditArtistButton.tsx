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
import {
  ArtistManagerSelectData,
  ArtistData,
  Country,
  Language,
  Zone,
} from '@/lib/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import PersonalDataForm from './EditArtistForm/PersonalDataForm';
import BillingDataForm from './EditArtistForm/BillingDataForm';
import SocialDataForm from './EditArtistForm/SocialDataForm';

export default function EditArtistButton({
  userData,
  languages,
  countries,
  zones,
  artistManagers,
}: {
  userData: ArtistData;
  languages: Language[];
  countries: Country[];
  zones: Zone[];
  artistManagers: ArtistManagerSelectData[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      modal
    >
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='max-w-max'
        >
          <Pencil />
          Modifica
        </Button>
      </DialogTrigger>
      <DialogContent className='h-dvh w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'>
        <DialogTitle className='hidden'>
          Form per modifica dati artista
        </DialogTitle>
        <DialogDescription className='hidden'>
          Effettua le modifiche necessarie al mantenimento del profilo
          aggiornato.
        </DialogDescription>

        {/* step section */}
        <section className='flex justify-center mb-4'>
          <div className='flex gap-2 py-1 px-2 border border-zinc-200 rounded-xl'>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer',
                step === 1 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent'
              )}
              onClick={() => setStep(1)}
            >
              Anagrafica
            </div>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer',
                step === 2 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent'
              )}
              onClick={() => setStep(2)}
            >
              Fatturazione
            </div>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer',
                step === 3 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent'
              )}
              onClick={() => setStep(3)}
            >
              Social
            </div>
          </div>
        </section>
        {/* tab section */}
        <section className='max-h-full overflow-y-auto'>
          {step === 1 && (
            <PersonalDataForm
              userData={userData}
              languages={languages}
              countries={countries}
              zones={zones}
              artistManagers={artistManagers}
              closeDialog={() => setIsDialogOpen(false)}
            />
          )}
          {step === 2 && (
            <BillingDataForm
              userData={userData}
              countries={countries}
              closeDialog={() => setIsDialogOpen(false)}
            />
          )}
          {step === 3 && (
            <SocialDataForm
              userData={userData}
              closeDialog={() => setIsDialogOpen(false)}
            />
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
