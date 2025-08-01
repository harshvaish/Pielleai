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
import { Country, VenueData, VenueManagerSelectData } from '@/lib/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import GeneralDataForm from './EditArtistForm/GeneralDataForm';
import BillingDataForm from './EditArtistForm/BillingDataForm';
import SocialDataForm from './EditArtistForm/SocialDataForm';

export default function EditVenueButton({
  venueData,
  countries,
  venueManagers,
}: {
  venueData: VenueData;
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
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
      <DialogContent className='h-dvh md:max-h-[94dvh] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'>
        <DialogTitle className='hidden'>
          Form per modifica dati locale
        </DialogTitle>
        <DialogDescription className='hidden'>
          Effettua le modifiche necessarie al mantenimento della scheda locale
          aggiornata.
        </DialogDescription>

        {/* step section */}
        <section className='flex justify-center mb-4 overflow-x-hidden'>
          <div className='flex gap-2 py-1 px-2 border border-zinc-200 rounded-xl overflow-x-auto'>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer whitespace-nowrap',
                step === 1 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent'
              )}
              onClick={() => setStep(1)}
            >
              Dati locale
            </div>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer whitespace-nowrap',
                step === 2 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent'
              )}
              onClick={() => setStep(2)}
            >
              Dati fatturazione
            </div>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer whitespace-nowrap',
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
            <GeneralDataForm
              venueData={venueData}
              countries={countries}
              venueManagers={venueManagers}
              closeDialog={() => setIsDialogOpen(false)}
            />
          )}
          {step === 2 && (
            <BillingDataForm
              venueData={venueData}
              countries={countries}
              closeDialog={() => setIsDialogOpen(false)}
            />
          )}
          {step === 3 && (
            <SocialDataForm
              venueData={venueData}
              closeDialog={() => setIsDialogOpen(false)}
            />
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
