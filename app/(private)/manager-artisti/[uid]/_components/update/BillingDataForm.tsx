import { FormProvider, useForm } from 'react-hook-form';
import { ArtistManagerData, Country } from '@/lib/types';
import { toast } from 'sonner';
import { ArtistManagerS2FormSchema, artistManagerS2FormSchema } from '@/lib/validation/artistManagerFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { editArtistManagerBillingData } from '@/lib/server-actions/artist-managers/edit-artist-manager-billing-data';
import { X } from 'lucide-react';
import StepTwo from '@/app/(private)/manager-artisti/_components/form/StepTwo';

export default function BillingDataForm({ userData, countries, closeDialog }: { userData: ArtistManagerData; countries: Country[]; closeDialog: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    [userData]
  );

  const methods = useForm({
    resolver: zodResolver(artistManagerS2FormSchema),
    defaultValues: defaultValues,
  });
  const router = useRouter();

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: ArtistManagerS2FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    setIsSubmitting(true);

    const response = await editArtistManagerBillingData({
      profileId: userData.profileId,
      data: data,
    });

    if (response.success) {
      toast.success('Profilo manager artisti aggiornato!');
      router.refresh();
      closeDialog();
    } else {
      toast.error(response.message);
    }
    setIsSubmitting(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <StepTwo countries={countries} />

        <div className='grid grid-cols-2 md:flex justify-between gap-4 mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
            variant='outline'
            className='text-destructive border-destructive'
            disabled={isSubmitting}
          >
            <X size={16} /> Annulla
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
