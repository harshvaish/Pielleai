'use client';

import { FormProvider, useForm } from 'react-hook-form';
import {
  ArtistManagerSelectData,
  ArtistData,
  Country,
  Language,
  Zone,
  UserRole,
} from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { ArtistS1FormSchema, artistS1FormSchema } from '@/lib/validation/artist-form-schema';
import { updateArtistPersonalData } from '@/lib/server-actions/artists/update-artist-personal-data';
import StepOne from '@/app/(private)/artisti/_components/form/StepOne';

type PersonalDataFormProps = {
  userRole: UserRole;
  userData: ArtistData;
  languages: Language[];
  countries: Country[];
  zones: Zone[];
  artistManagers: ArtistManagerSelectData[];
  closeDialog: () => void;
};

export default function PersonalDataForm({
  userRole,
  userData,
  languages,
  countries,
  zones,
  artistManagers,
  closeDialog,
}: PersonalDataFormProps) {
  const [isPending, startTransition] = useTransition();
  const languageIds = userData.languages.map((lang) => lang.id);
  const zonesIds = userData.zones.map((zone) => zone.id);
  const managersIds = userData.managers.map((manager) => manager.profileId);

  const defaultValues = useMemo(
    () => ({
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
    }),
    [userData],
  );

  const methods = useForm({
    resolver: zodResolver(artistS1FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: ArtistS1FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    startTransition(async () => {
      const response = await updateArtistPersonalData(userData.id, data);

      if (response.success) {
        closeDialog();
        toast.success('Profilo artista aggiornato!');
        startTransition(async () => router.refresh());
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4 p-2'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <StepOne
          userRole={userRole}
          artistManagers={artistManagers}
          countries={countries}
          languages={languages}
          zones={zones}
        />

        <div className='flex justify-between mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
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
  );
}
