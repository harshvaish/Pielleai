import { FormProvider, useForm } from 'react-hook-form';
import { ArtistData, Country } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { ArtistS2FormSchema, artistS2FormSchema } from '@/lib/validation/artistFormSchema';
import { updateArtistBillingData } from '@/lib/server-actions/artists/update-artist-billing-data';
import StepTwo from '@/app/(private)/artisti/_components/form/StepTwo';

type BillingDataFormProps = { userData: ArtistData; countries: Country[]; closeDialog: () => void };

export default function BillingDataForm({
  userData,
  countries,
  closeDialog,
}: BillingDataFormProps) {
  const defaultValues = useMemo(
    () => ({
      company: userData.company || '',
      taxCode: userData.taxCode || '',
      ipiCode: userData.ipiCode || '',
      bicCode: userData.bicCode || undefined,
      abaRoutingNumber: userData.abaRoutingNumber || undefined,
      iban: userData.iban || '',
      sdiRecipientCode: userData.sdiRecipientCode || undefined,
      billingAddress: userData.billingAddress || '',
      billingCountry: userData.billingCountry || 0,
      billingSubdivisionId: userData.billingSubdivision.id || 0,
      billingCity: userData.billingCity || '',
      billingZipCode: userData.billingZipCode || '',
      billingEmail: userData.billingEmail || '',
      billingPhone: userData.billingPhone || '',
      billingPec: userData.billingPec || '',
      taxableInvoice: userData.taxableInvoice.toString() || 'false',
    }),
    [userData],
  );

  const methods = useForm({
    resolver: zodResolver(artistS2FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  const onSubmit = async (data: ArtistS2FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    const response = await updateArtistBillingData(userData.id, data);

    if (response.success) {
      toast.success('Profilo artista aggiornato!');
      router.refresh();
      closeDialog();
    } else {
      toast.error(response.message);
    }
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
            disabled={isSubmitting}
          >
            <X /> Annulla
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
