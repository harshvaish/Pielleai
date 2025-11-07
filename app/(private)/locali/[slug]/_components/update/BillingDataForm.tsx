import { FormProvider, useForm } from 'react-hook-form';
import { Country, VenueData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { VenueS2FormSchema, venueS2FormSchema } from '@/lib/validation/venue-form-schema';
import { updateVenueBillingData } from '@/lib/server-actions/venues/update-venue-billing-data';
import StepTwo from '../../../_components/form/StepTwo';

type BillingDataFormProps = { venueData: VenueData; countries: Country[]; closeDialog: () => void };

export default function BillingDataForm({
  venueData,
  countries,
  closeDialog,
}: BillingDataFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
      company: venueData.company || '',
      taxCode: venueData.taxCode || '',
      vatCode: venueData.vatCode || '',
      bicCode: venueData.bicCode || undefined,
      abaRoutingNumber: venueData.abaRoutingNumber || undefined,
      sdiRecipientCode: venueData.sdiRecipientCode || undefined,
      billingAddress: venueData.billingAddress || '',
      billingCountry: venueData.billingCountry || 0,
      billingSubdivisionId: venueData.billingSubdivision.id || 0,
      billingCity: venueData.billingCity || '',
      billingZipCode: venueData.billingZipCode || '',
      billingEmail: venueData.billingEmail || '',
      billingPhone: venueData.billingPhone || '',
      billingPec: venueData.billingPec || '',
    }),
    [venueData],
  );

  const methods = useForm({
    resolver: zodResolver(venueS2FormSchema),
    defaultValues: defaultValues,
  });

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: VenueS2FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    startTransition(async () => {
      const response = await updateVenueBillingData(venueData.id, data);

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
        <StepTwo countries={countries} />

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
