import { FormProvider, useForm } from 'react-hook-form';
import { ArtistManagerData, Country } from '@/lib/types';
import { toast } from 'sonner';
import {
  ArtistManagerS2FormSchema,
  artistManagerS2FormSchema,
} from '@/lib/validation/artist-manager-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { updateArtistManagerBillingData } from '@/lib/server-actions/artist-managers/update-artist-manager-billing-data';
import { X } from 'lucide-react';
import StepTwo from '@/app/(private)/manager-artisti/_components/form/StepTwo';

export default function BillingDataForm({
  userData,
  countries,
  closeDialog,
}: {
  userData: ArtistManagerData;
  countries: Country[];
  closeDialog: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
      billingAddressFormatted: userData.billingAddressFormatted || '',
      billingStreetName: userData.billingStreetName || '',
      billingStreetNumber: userData.billingStreetNumber || '',
      billingPlaceId: userData.billingPlaceId || '',
      billingLatitude: userData.billingLatitude || undefined,
      billingLongitude: userData.billingLongitude || undefined,
      billingCountryName: userData.billingCountryName || '',
      billingCountryCode: userData.billingCountryCode || '',
      billingCountry: userData.billingCountry || undefined,
      billingSubdivisionId: userData.billingSubdivision?.id || 0,
      billingCity: userData.billingCity || '',
      billingZipCode: userData.billingZipCode || '',
      billingEmail: userData.billingEmail || '',
      billingPhone: userData.billingPhone || '',
      billingPec: userData.billingPec || '',
      taxableInvoice: userData.taxableInvoice?.toString() || 'false',
    }),
    [userData],
  );

  const methods = useForm({
    resolver: zodResolver(artistManagerS2FormSchema),
    defaultValues: defaultValues,
  });

  const {
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: ArtistManagerS2FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    startTransition(async () => {
      const response = await updateArtistManagerBillingData(userData.profileId, data);

      if (response.success) {
        closeDialog();
        toast.success('Profilo manager artisti aggiornato!');
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

        <div className='grid grid-cols-2 md:flex justify-between gap-4 mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
            variant='outline'
            className='text-destructive border-destructive'
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
