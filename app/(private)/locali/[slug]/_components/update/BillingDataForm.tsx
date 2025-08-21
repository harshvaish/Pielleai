import { FormProvider, useForm } from 'react-hook-form';
import { Country, VenueData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { VenueS2FormSchema, venueS2FormSchema } from '@/lib/validation/venueFormSchema';
import { editVenueBillingData } from '@/lib/server-actions/venues/edit-venue-billing-data';
import StepTwo from '../../../_components/form/StepTwo';

type BillingDataFormProps = { venueData: VenueData; countries: Country[]; closeDialog: () => void };

export default function BillingDataForm({ venueData, countries, closeDialog }: BillingDataFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const defaultValues = useMemo(
    () => ({
      company: venueData.company || '',
      taxCode: venueData.taxCode || '',
      ipiCode: venueData.ipiCode || '',
      bicCode: venueData.bicCode || undefined,
      abaRoutingNumber: venueData.abaRoutingNumber || undefined,
      iban: venueData.iban || '',
      sdiRecipientCode: venueData.sdiRecipientCode || undefined,
      billingAddress: venueData.billingAddress || '',
      billingCountry: venueData.billingCountry || 0,
      billingSubdivisionId: venueData.billingSubdivision.id || 0,
      billingCity: venueData.billingCity || '',
      billingZipCode: venueData.billingZipCode || '',
      billingEmail: venueData.billingEmail || '',
      billingPhone: venueData.billingPhone || '',
      billingPec: venueData.billingPec || '',
      taxableInvoice: venueData.taxableInvoice.toString() || 'false',
    }),
    [venueData]
  );

  const methods = useForm({
    resolver: zodResolver(venueS2FormSchema),
    defaultValues: defaultValues,
  });
  const router = useRouter();

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: VenueS2FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    setSubmitting(true);

    const response = await editVenueBillingData({
      venueId: venueData.id,
      data: data,
    });

    if (response.success) {
      toast.success('Scheda locale aggiornata!');
      router.refresh();
      closeDialog();
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
        <StepTwo countries={countries} />

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
