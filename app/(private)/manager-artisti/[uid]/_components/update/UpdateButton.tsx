'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil, X } from 'lucide-react';
import { ArtistManagerData, Country, Language } from '@/lib/types';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artistManagerProfileFormSchema } from '@/lib/validation/artist-manager-form-schema';
import StepOne from '@/app/(private)/manager-artisti/_components/form/StepOne';
import StepTwo from '@/app/(private)/manager-artisti/_components/form/StepTwo';
import { toast } from 'sonner';
import { updateArtistManagerPersonalData } from '@/lib/server-actions/artist-managers/update-artist-manager-personal-data';
import { updateArtistManagerBillingData } from '@/lib/server-actions/artist-managers/update-artist-manager-billing-data';
import { useRouter } from 'next/navigation';

type UpdateButtonProps = {
  userData: ArtistManagerData;
  languages: Language[];
  countries: Country[];
};

export default function UpdateButton({ userData, languages, countries }: UpdateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isPending, startTransition] = useTransition();

  const languageIds = useMemo(() => userData.languages.map((lang) => lang.id), [userData]);

  const defaultValues = useMemo(
    () => ({
      // step 1
      avatarUrl: userData.avatarUrl || '',
      name: userData.name || '',
      surname: userData.surname || '',
      phone: userData.phone || '',
      birthDate: userData.birthDate || '',
      birthPlace: userData.birthPlace || '',
      languages: languageIds || [],
      address: userData.address || '',
      addressFormatted: userData.addressFormatted || '',
      streetName: userData.streetName || '',
      streetNumber: userData.streetNumber || '',
      placeId: userData.placeId || '',
      latitude: userData.latitude || undefined,
      longitude: userData.longitude || undefined,
      countryName: userData.countryName || '',
      countryCode: userData.countryCode || '',
      countryId: userData.country?.id || 0,
      subdivisionId: userData.subdivision?.id || 0,
      city: userData.city || '',
      zipCode: userData.zipCode || '',
      gender: userData.gender || 'male',

      // step 2
      company: userData.company || '',
      taxCode: userData.taxCode || '',
      ipiCode: userData.ipiCode || '',
      bicCode: userData.bicCode || undefined,
      abaRoutingNumber: userData.abaRoutingNumber || undefined,
      iban: userData.iban || '',
      sdiRecipientCode: userData.sdiRecipientCode || undefined,
      billingAddress: userData.billingAddress || '',
      billingAddressFormatted: userData.billingAddressFormatted || '',
      billingStreetName: userData.billingStreetName || '',
      billingStreetNumber: userData.billingStreetNumber || '',
      billingPlaceId: userData.billingPlaceId || '',
      billingLatitude: userData.billingLatitude || undefined,
      billingLongitude: userData.billingLongitude || undefined,
      billingCountryName: userData.billingCountryName || '',
      billingCountryCode: userData.billingCountryCode || '',
      billingCountry: userData.billingCountry || undefined,
      billingSubdivisionId: userData.billingSubdivision?.id || 0,
      billingCity: userData.billingCity || '',
      billingZipCode: userData.billingZipCode || '',
      billingEmail: userData.billingEmail || '',
      billingPhone: userData.billingPhone || '',
      billingPec: userData.billingPec || '',
      taxableInvoice: userData.taxableInvoice?.toString() || 'false',
    }),
    [languageIds, userData],
  );

  const methods = useForm({
    resolver: zodResolver(artistManagerProfileFormSchema),
    defaultValues,
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!open) return;
    methods.reset(defaultValues);
    setStep(1);
  }, [defaultValues, methods, open]);

  const hasDirtyField = (keys: string[]) => {
    const dirtyFields = methods.formState.dirtyFields as Record<string, unknown>;
    return keys.some((key) => Boolean(dirtyFields[key]));
  };

  const dirtyS1 = () =>
    hasDirtyField([
      'avatarUrl',
      'name',
      'surname',
      'phone',
      'birthDate',
      'birthPlace',
      'languages',
      'address',
      'addressFormatted',
      'streetName',
      'streetNumber',
      'placeId',
      'latitude',
      'longitude',
      'countryName',
      'countryCode',
      'countryId',
      'subdivisionId',
      'city',
      'zipCode',
      'gender',
    ]);

  const dirtyS2 = () =>
    hasDirtyField([
      'company',
      'taxCode',
      'ipiCode',
      'bicCode',
      'abaRoutingNumber',
      'iban',
      'sdiRecipientCode',
      'billingAddress',
      'billingAddressFormatted',
      'billingStreetName',
      'billingStreetNumber',
      'billingPlaceId',
      'billingLatitude',
      'billingLongitude',
      'billingCountryName',
      'billingCountryCode',
      'billingCountry',
      'billingSubdivisionId',
      'billingCity',
      'billingZipCode',
      'billingEmail',
      'billingPhone',
      'billingPec',
      'taxableInvoice',
    ]);

  const handleSubmit = (data: any) => {
    if (!methods.formState.isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    startTransition(async () => {
      const shouldUpdateS1 = dirtyS1();
      const shouldUpdateS2 = dirtyS2();

      if (shouldUpdateS1) {
        const response = await updateArtistManagerPersonalData(userData.profileId, data);
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      }

      if (shouldUpdateS2) {
        const response = await updateArtistManagerBillingData(userData.profileId, data);
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      }

      setOpen(false);
      setStep(1);
      toast.success('Profilo manager artisti aggiornato!');
      startTransition(async () => router.refresh());
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setStep(1);
      }}
      modal
    >
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='xs'
          className='max-w-max'
        >
          <Pencil />
          Modifica
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className='h-dvh md:max-h-[94dvh] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'
      >
        <DialogTitle className='hidden'>Form per modifica dati manager artista</DialogTitle>
        <DialogDescription className='hidden'>
          Effettua le modifiche necessarie al mantenimento del profilo aggiornato.
        </DialogDescription>

        {/* step section */}
        <section className='flex justify-center mb-4'>
          <div className='flex gap-2 py-1 px-2 border border-zinc-200 rounded-xl'>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer',
                step === 1 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent',
              )}
              onClick={() => setStep(1)}
            >
              Anagrafica
            </div>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer',
                step === 2 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent',
              )}
              onClick={() => setStep(2)}
            >
              Fatturazione
            </div>
          </div>
        </section>
        {/* tab section */}
        <section className='max-h-full overflow-y-auto'>
          <FormProvider {...methods}>
            <form
              className='flex flex-col gap-4 p-2'
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              {step === 1 && (
                <StepOne
                  countries={countries}
                  languages={languages}
                />
              )}
              {step === 2 && <StepTwo countries={countries} />}

              <div className='grid grid-cols-2 md:flex justify-between gap-4 mt-4'>
                <Button
                  type='button'
                  onClick={() => setOpen(false)}
                  variant='outline'
                  className='text-destructive border-destructive'
                  disabled={isPending}
                >
                  <X className='size-4' /> Annulla
                </Button>

                <Button
                  type='submit'
                  disabled={isPending}
                >
                  {isPending ? 'Salvataggio...' : 'Salva'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </section>
      </DialogContent>
    </Dialog>
  );
}
