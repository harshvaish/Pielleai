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
import {
  ArtistManagerSelectData,
  ArtistData,
  Country,
  Language,
  Zone,
  UserRole,
} from '@/lib/types';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artistFormSchema } from '@/lib/validation/artist-form-schema';
import StepOne from '@/app/(private)/artisti/_components/form/StepOne';
import StepTwo from '@/app/(private)/artisti/_components/form/StepTwo';
import StepThree from '@/app/(private)/artisti/_components/form/StepThree';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { updateArtistPersonalData } from '@/lib/server-actions/artists/update-artist-personal-data';
import { updateArtistBillingData } from '@/lib/server-actions/artists/update-artist-billing-data';
import { updateArtistSocialData } from '@/lib/server-actions/artists/update-artist-social-data';

type EditArtistButtonProps = {
  userRole: UserRole;
  userData: ArtistData;
  languages: Language[];
  countries: Country[];
  zones: Zone[];
  artistManagers: ArtistManagerSelectData[];
};

export default function EditArtistButton({
  userRole,
  userData,
  languages,
  countries,
  zones,
  artistManagers,
}: EditArtistButtonProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();

  const languageIds = useMemo(() => userData.languages.map((lang) => lang.id), [userData]);
  const zonesIds = useMemo(() => userData.zones.map((zone) => zone.id), [userData]);
  const managersIds = useMemo(
    () => userData.managers.map((manager) => manager.profileId),
    [userData],
  );

  const defaultValues = useMemo(
    () => ({
      // step 1
      avatarUrl: userData.avatarUrl || '',
      name: userData.name || '',
      surname: userData.surname || '',
      stageName: userData.stageName || '',
      bio: userData.bio || '',
      categories: userData.categories || [],
      capacityCategory: userData.capacityCategory || undefined,
      phone: userData.phone || '',
      email: userData.email || '',
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
      countryId: userData.country?.id || undefined,
      subdivisionId: userData.subdivision?.id || undefined,
      city: userData.city || '',
      zipCode: userData.zipCode || '',
      gender: userData.gender || 'male',

      zones: zonesIds || [],

      artistManagers: managersIds || [],

      tourManagerEmail: userData.tourManagerEmail || '',
      tourManagerName: userData.tourManagerName || '',
      tourManagerSurname: userData.tourManagerSurname || '',
      tourManagerPhone: userData.tourManagerPhone || '',

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
      billingSubdivisionId: userData.billingSubdivision?.id || undefined,
      billingCity: userData.billingCity || '',
      billingZipCode: userData.billingZipCode || '',
      billingEmail: userData.billingEmail || '',
      billingPhone: userData.billingPhone || '',
      billingPec: userData.billingPec || '',
      taxableInvoice: userData.taxableInvoice?.toString() || 'false',

      // step 3
      tiktokUrl: userData.tiktokUrl || '',
      tiktokUsername: userData.tiktokUsername || '',
      tiktokFollowers: userData.tiktokFollowers || undefined,
      tiktokCreatedAt: userData.tiktokCreatedAt
        ? format(new Date(userData.tiktokCreatedAt), 'yyyy-MM-dd')
        : undefined,

      facebookUrl: userData.facebookUrl || '',
      facebookUsername: userData.facebookUsername || '',
      facebookFollowers: userData.facebookFollowers || undefined,
      facebookCreatedAt: userData.facebookCreatedAt
        ? format(new Date(userData.facebookCreatedAt), 'yyyy-MM-dd')
        : undefined,

      instagramUrl: userData.instagramUrl || '',
      instagramUsername: userData.instagramUsername || '',
      instagramFollowers: userData.instagramFollowers || undefined,
      instagramCreatedAt: userData.instagramCreatedAt
        ? format(new Date(userData.instagramCreatedAt), 'yyyy-MM-dd')
        : undefined,

      xUrl: userData.xUrl || '',
      xUsername: userData.xUsername || '',
      xFollowers: userData.xFollowers || undefined,
      xCreatedAt: userData.xCreatedAt
        ? format(new Date(userData.xCreatedAt), 'yyyy-MM-dd')
        : undefined,
    }),
    [languageIds, managersIds, userData, zonesIds],
  );

  const methods = useForm({
    resolver: zodResolver(artistFormSchema),
    defaultValues,
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!isDialogOpen) return;
    methods.reset(defaultValues);
    setStep(1);
  }, [defaultValues, isDialogOpen, methods]);

  const hasDirtyField = (keys: string[]) => {
    const dirtyFields = methods.formState.dirtyFields as Record<string, unknown>;
    return keys.some((key) => Boolean(dirtyFields[key]));
  };

  const dirtyS1 = () =>
    hasDirtyField([
      'avatarUrl',
      'name',
      'surname',
      'stageName',
      'bio',
      'categories',
      'capacityCategory',
      'phone',
      'email',
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
      'zones',
      'artistManagers',
      'tourManagerEmail',
      'tourManagerName',
      'tourManagerSurname',
      'tourManagerPhone',
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
        const response = await updateArtistPersonalData(userData.id, data);
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      }

      if (shouldUpdateS2) {
        const response = await updateArtistBillingData(userData.id, data);
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      }

      if (shouldUpdateS3) {
        const response = await updateArtistSocialData(userData.id, data);
        if (!response.success) {
          toast.error(response.message);
          return;
        }
      }

      setIsDialogOpen(false);
      setStep(1);
      toast.success('Profilo artista aggiornato!');
      startTransition(async () => router.refresh());
    });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(nextOpen) => {
        setIsDialogOpen(nextOpen);
        if (!nextOpen) setStep(1);
      }}
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
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className='h-dvh md:max-h-[94dvh] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'
      >
        <DialogTitle className='hidden'>Form per modifica dati artista</DialogTitle>
        <DialogDescription className='hidden'>
          Effettua le modifiche necessarie al mantenimento del profilo aggiornato.
        </DialogDescription>

        {/* step section */}
        <section className='flex justify-center mb-4'>
          <div className='w-full flex gap-2 py-1 px-2 border border-zinc-200 rounded-xl'>
            <div
              className={cn(
                'grow text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer',
                step === 1 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent',
              )}
              onClick={() => setStep(1)}
            >
              Anagrafica
            </div>
            <div
              className={cn(
                'grow text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer',
                step === 2 ? 'bg-zinc-100' : 'text-zinc-600 bg-transparent',
              )}
              onClick={() => setStep(2)}
            >
              Fatturazione
            </div>
            <div
              className={cn(
                'grow text-sm font-semibold text-center py-1.5 px-3 rounded-lg hover:cursor-pointer',
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
                  artistManagers={artistManagers}
                  countries={countries}
                  languages={languages}
                  zones={zones}
                />
              )}
              {step === 2 && <StepTwo countries={countries} />}
              {step === 3 && <StepThree />}

              <div className='flex justify-between mt-4'>
                <Button
                  type='button'
                  onClick={() => setIsDialogOpen(false)}
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
