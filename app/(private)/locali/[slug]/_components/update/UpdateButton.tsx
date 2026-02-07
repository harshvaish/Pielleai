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
import { Country, UserRole, VenueData, VenueManagerSelectData } from '@/lib/types';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { venueFormSchema } from '@/lib/validation/venue-form-schema';
import StepOne from '../../../_components/form/StepOne';
import StepTwo from '../../../_components/form/StepTwo';
import StepThree from '../../../_components/form/StepThree';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { updateVenueGeneralData } from '@/lib/server-actions/venues/update-venue-general-data';
import { updateVenueBillingData } from '@/lib/server-actions/venues/update-venue-billing-data';
import { updateVenueSocialData } from '@/lib/server-actions/venues/update-venue-social-data';

type UpdateButtonProps = {
  userRole: UserRole;
  venueData: VenueData;
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
};

export default function UpdateButton({
  userRole,
  venueData,
  countries,
  venueManagers,
}: UpdateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
      // step 1
      avatarUrl: venueData.avatarUrl || undefined,
      name: venueData.name || '',
      bio: venueData.bio || '',
      type: venueData.type || 'small',
      capacity: venueData.capacity > 0 ? venueData.capacity : undefined,
      address: venueData.address || '',
      addressFormatted: venueData.addressFormatted || '',
      streetName: venueData.streetName || '',
      streetNumber: venueData.streetNumber || '',
      placeId: venueData.placeId || '',
      latitude: venueData.latitude || undefined,
      longitude: venueData.longitude || undefined,
      countryName: venueData.countryName || '',
      countryCode: venueData.countryCode || '',
      countryId: venueData.country?.id || 0,
      subdivisionId: venueData.subdivision?.id || 0,
      city: venueData.city || '',
      zipCode: venueData.zipCode || '',
      venueManagerId: venueData.manager?.profileId || undefined,

      // step 2
      company: venueData.company || '',
      taxCode: venueData.taxCode || '',
      vatCode: venueData.vatCode || '',
      bicCode: venueData.bicCode || undefined,
      abaRoutingNumber: venueData.abaRoutingNumber || undefined,
      sdiRecipientCode: venueData.sdiRecipientCode || undefined,
      billingAddress: venueData.billingAddress || '',
      billingAddressFormatted: venueData.billingAddressFormatted || '',
      billingStreetName: venueData.billingStreetName || '',
      billingStreetNumber: venueData.billingStreetNumber || '',
      billingPlaceId: venueData.billingPlaceId || '',
      billingLatitude: venueData.billingLatitude || undefined,
      billingLongitude: venueData.billingLongitude || undefined,
      billingCountryName: venueData.billingCountryName || '',
      billingCountryCode: venueData.billingCountryCode || '',
      billingCountry: venueData.billingCountry || undefined,
      billingSubdivisionId: venueData.billingSubdivision?.id || 0,
      billingCity: venueData.billingCity || '',
      billingZipCode: venueData.billingZipCode || '',
      billingEmail: venueData.billingEmail || '',
      billingPhone: venueData.billingPhone || '',
      billingPec: venueData.billingPec || '',

      // step 3
      tiktokUrl: venueData.tiktokUrl || '',
      tiktokUsername: venueData.tiktokUsername || '',
      tiktokFollowers: venueData.tiktokFollowers || undefined,
      tiktokCreatedAt: venueData.tiktokCreatedAt
        ? format(new Date(venueData.tiktokCreatedAt), 'yyyy-MM-dd')
        : undefined,

      facebookUrl: venueData.facebookUrl || '',
      facebookUsername: venueData.facebookUsername || '',
      facebookFollowers: venueData.facebookFollowers || undefined,
      facebookCreatedAt: venueData.facebookCreatedAt
        ? format(new Date(venueData.facebookCreatedAt), 'yyyy-MM-dd')
        : undefined,

      instagramUrl: venueData.instagramUrl || '',
      instagramUsername: venueData.instagramUsername || '',
      instagramFollowers: venueData.instagramFollowers || undefined,
      instagramCreatedAt: venueData.instagramCreatedAt
        ? format(new Date(venueData.instagramCreatedAt), 'yyyy-MM-dd')
        : undefined,

      xUrl: venueData.xUrl || '',
      xUsername: venueData.xUsername || '',
      xFollowers: venueData.xFollowers || undefined,
      xCreatedAt: venueData.xCreatedAt
        ? format(new Date(venueData.xCreatedAt), 'yyyy-MM-dd')
        : undefined,
    }),
    [venueData],
  );

  const methods = useForm({
    resolver: zodResolver(venueFormSchema),
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
      'bio',
      'type',
      'capacity',
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
      'venueManagerId',
    ]);

  const dirtyS2 = () =>
    hasDirtyField([
      'company',
      'taxCode',
      'vatCode',
      'bicCode',
      'abaRoutingNumber',
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
    ]);

  const dirtyS3 = () =>
    hasDirtyField([
      'tiktokUrl',
      'tiktokUsername',
      'tiktokFollowers',
      'tiktokCreatedAt',
      'facebookUrl',
      'facebookUsername',
      'facebookFollowers',
      'facebookCreatedAt',
      'instagramUrl',
      'instagramUsername',
      'instagramFollowers',
      'instagramCreatedAt',
      'xUrl',
      'xUsername',
      'xFollowers',
      'xCreatedAt',
    ]);

  const handleSubmit = (data: any) => {
    if (!methods.formState.isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    startTransition(async () => {
      const shouldUpdateS1 = dirtyS1();
      const shouldUpdateS2 = dirtyS2();
      const shouldUpdateS3 = dirtyS3();

      if (shouldUpdateS1) {
        const response = await updateVenueGeneralData(venueData.id, data);
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      }

      if (shouldUpdateS2) {
        const response = await updateVenueBillingData(venueData.id, data);
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      }

      if (shouldUpdateS3) {
        const response = await updateVenueSocialData(venueData.id, data);
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      }

      setOpen(false);
      setStep(1);
      toast.success('Scheda locale aggiornata!');
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
          size='sm'
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
        <DialogTitle className='hidden'>Form per modifica dati locale</DialogTitle>
        <DialogDescription className='hidden'>
          Effettua le modifiche necessarie al mantenimento della scheda locale aggiornata.
        </DialogDescription>

        {/* step section */}
        <section className='flex justify-center mb-4 overflow-x-hidden'>
          <div className='flex gap-2 py-1 px-2 border border-zinc-200 rounded-xl overflow-x-auto'>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer whitespace-nowrap',
                step === 1 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent',
              )}
              onClick={() => setStep(1)}
            >
              Dati locale
            </div>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer whitespace-nowrap',
                step === 2 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent',
              )}
              onClick={() => setStep(2)}
            >
              Dati fatturazione
            </div>
            <div
              className={cn(
                'w-40 text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer whitespace-nowrap',
                step === 3 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent',
              )}
              onClick={() => setStep(3)}
            >
              Social
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
                  userRole={userRole}
                  countries={countries}
                  venueManagers={venueManagers}
                />
              )}
              {step === 2 && <StepTwo countries={countries} />}
              {step === 3 && <StepThree />}

              <div className='flex justify-between mt-4'>
                <Button
                  type='button'
                  onClick={() => setOpen(false)}
                  variant='ghost'
                  className='text-destructive'
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
