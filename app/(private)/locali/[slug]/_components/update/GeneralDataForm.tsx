'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { Country, VenueData, VenueManagerSelectData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { EditVenueS1FormSchema, editVenueS1FormSchema } from '@/lib/validation/venueFormSchema';
import { updateVenueGeneralData } from '@/lib/server-actions/venues/update-venue-general-data';
import StepOne from '../../../_components/form/StepOne';

type GeneralDataFormProps = {
  venueData: VenueData;
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
  closeDialog: () => void;
};

export default function GeneralDataForm({ venueData, countries, venueManagers, closeDialog }: GeneralDataFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const defaultValues = useMemo(
    () => ({
      avatarUrl: venueData.avatarUrl || '',
      name: venueData.name || '',
      type: venueData.type || 'small',
      capacity: venueData.capacity || 0,
      address: venueData.address || '',
      countryId: venueData.country.id || 0,
      subdivisionId: venueData.subdivision.id || 0,
      city: venueData.city || '',
      zipCode: venueData.zipCode || '',
      venueManagerId: venueData.manager.profileId || 0,
    }),
    [venueData]
  );

  const methods = useForm({
    resolver: zodResolver(editVenueS1FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: EditVenueS1FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }
    setSubmitting(true);

    const response = await updateVenueGeneralData(venueData.id, data);

    if (response.success) {
      methods.reset(data); // new form status, isDirty to false
      toast.success('Scheda locale aggiornata!');
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
          venueManagers={venueManagers}
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
