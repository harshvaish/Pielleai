'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { Country, Language, VenueManagerData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { VenueManagerS1FormSchema, venueManagerS1FormSchema } from '@/lib/validation/venueManagerFormSchema';
import { editVenueManagerPersonalData } from '@/lib/server-actions/venue-managers/edit-venue-manager-personal-data';
import StepOne from '../../../_components/form/StepOne';

type PersonalDataForm = { userData: VenueManagerData; languages: Language[]; countries: Country[]; closeDialog: () => void };

export default function PersonalDataForm({ userData, languages, countries, closeDialog }: PersonalDataForm) {
  const [submitting, setSubmitting] = useState<boolean>(false);

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
      gender: userData.gender || 'maschile',
    }),
    [userData]
  );

  const methods = useForm({
    resolver: zodResolver(venueManagerS1FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: VenueManagerS1FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }
    setSubmitting(true);

    const response = await editVenueManagerPersonalData({
      profileId: userData.profileId,
      data: data,
    });

    if (response.success) {
      methods.reset(data); // new form status, isDirty to false
      toast.success('Profilo promoter locali aggiornato!');
      closeDialog();
      router.refresh();
    } else {
      toast.error(response.message);
    }
    setSubmitting(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <StepOne
          countries={countries}
          languages={languages}
        />

        <div className='flex justify-between mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
            variant='ghost'
            className='text-destructive'
            disabled={submitting}
          >
            <X className='size-4' /> Annulla
          </Button>

          <Button
            type='submit'
            disabled={submitting}
          >
            {submitting ? 'Salvataggio...' : 'Salva'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
