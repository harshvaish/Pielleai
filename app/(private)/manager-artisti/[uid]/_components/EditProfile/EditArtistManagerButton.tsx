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
import { ArtistsManagerData, Country, Language } from '@/lib/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import PersonalDataForm from './EditArtistManagerForm/PersonalDataForm';
import BillingDataForm from './EditArtistManagerForm/BillingDataForm';

export default function EditArtistManagerButton({
  userData,
  languages,
  countries,
}: {
  userData: ArtistsManagerData;
  languages: Language[];
  countries: Country[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2>(1);

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
          Form per modifica dati manager artista
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
          </div>
        </section>
        {/* tab section */}
        <section className='max-h-full overflow-y-auto'>
          {step === 1 && (
            <PersonalDataForm
              userData={userData}
              languages={languages}
              countries={countries}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
          {step === 2 && (
            <BillingDataForm
              userData={userData}
              countries={countries}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
