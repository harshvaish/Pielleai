'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { ArtistManagerData, Country, Language } from '@/lib/types';
import { toast } from 'sonner';
import {
  ArtistManagerS1FormSchema,
  artistManagerS1FormSchema,
} from '@/lib/validation/artist-manager-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { updateArtistManagerPersonalData } from '@/lib/server-actions/artist-managers/update-artist-manager-personal-data';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import StepOne from '@/app/(private)/manager-artisti/_components/form/StepOne';

export default function PersonalDataForm({
  userData,
  languages,
  countries,
  closeDialog,
}: {
  userData: ArtistManagerData;
  languages: Language[];
  countries: Country[];
  closeDialog: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const languageIds = userData.languages.map((lang) => lang.id);

  const defaultValues = useMemo(
    () => ({
      avatarUrl: userData.avatarUrl || '',
      name: userData.name || '',
      surname: userData.surname || '',
      phone: userData.phone || '',
      email: userData.email || '',
      birthDate: userData.birthDate || '',
      birthPlace: userData.birthPlace || '',
      languages: languageIds || [],
      address: userData.address || '',
      countryId: userData.country.id || 0,
      subdivisionId: userData.subdivision.id || 0,
      city: userData.city || '',
      zipCode: userData.zipCode || '',
      gender: userData.gender || 'male',
    }),
    [userData],
  );

  const methods = useForm({
    resolver: zodResolver(artistManagerS1FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: ArtistManagerS1FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }
    setIsSubmitting(true);

    const response = await updateArtistManagerPersonalData(userData.profileId, data);

    if (response.success) {
      closeDialog();
      toast.success('Profilo manager artisti aggiornato!');
      router.refresh();
    } else {
      toast.error(response.message);
    }
    setIsSubmitting(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4 p-2'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <StepOne
          countries={countries}
          languages={languages}
        />

        <div className='grid grid-cols-2 md:flex justify-between gap-4 mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
            variant='outline'
            className='text-destructive border-destructive'
            disabled={isSubmitting}
          >
            <X className='size-4' /> Annulla
          </Button>

          <Button
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvataggio...' : 'Salva'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
