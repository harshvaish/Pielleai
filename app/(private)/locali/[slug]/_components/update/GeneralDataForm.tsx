'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { Country, UserRole, VenueData, VenueManagerSelectData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { venueS1FormSchema, VenueS1FormSchema } from '@/lib/validation/venue-form-schema';
import { updateVenueGeneralData } from '@/lib/server-actions/venues/update-venue-general-data';
import StepOne from '../../../_components/form/StepOne';

type GeneralDataFormProps = {
  userRole: UserRole;
  venueData: VenueData;
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
  closeDialog: () => void;
};

export default function GeneralDataForm({
  userRole,
  venueData,
  countries,
  venueManagers,
  closeDialog,
}: GeneralDataFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
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
      acceptTerms: true,
    }),
    [venueData],
  );

  const methods = useForm({
    resolver: zodResolver(venueS1FormSchema),
    defaultValues: defaultValues,
  });

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: VenueS1FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    startTransition(async () => {
      const response = await updateVenueGeneralData(venueData.id, data);

      if (response.success) {
        closeDialog();
        toast.success('Scheda locale aggiornata!');
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
          countries={countries}
          venueManagers={venueManagers}
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
