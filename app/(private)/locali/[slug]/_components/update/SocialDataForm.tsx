'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { VenueData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { venueS3FormSchema, VenueS3FormSchema } from '@/lib/validation/venue-form-schema';
import { updateVenueSocialData } from '@/lib/server-actions/venues/update-venue-social-data';
import StepThree from '../../../_components/form/StepThree';

type SocialDataFormProps = {
  venueData: VenueData;
  closeDialog: () => void;
};

export default function SocialDataForm({ venueData, closeDialog }: SocialDataFormProps) {
  const defaultValues = useMemo(
    () => ({
      tiktokUrl: venueData.tiktokUrl || '',
      tiktokUsername: venueData.tiktokUsername || '',
      tiktokFollowers: venueData.tiktokFollowers || undefined,
      tiktokCreatedAt: venueData.tiktokCreatedAt
        ? format(new Date(venueData.tiktokCreatedAt), 'yyyy-MM-dd')
        : undefined,

      facebookUrl: venueData.facebookUrl || '',
      facebookUsername: venueData.facebookUsername || '',
      facebookFollowers: venueData.facebookFollowers || undefined,
      facebookCreatedAt: venueData.facebookCreatedAt
        ? format(new Date(venueData.facebookCreatedAt), 'yyyy-MM-dd')
        : undefined,

      instagramUrl: venueData.instagramUrl || '',
      instagramUsername: venueData.instagramUsername || '',
      instagramFollowers: venueData.instagramFollowers || undefined,
      instagramCreatedAt: venueData.instagramCreatedAt
        ? format(new Date(venueData.instagramCreatedAt), 'yyyy-MM-dd')
        : undefined,

      xUrl: venueData.xUrl || '',
      xUsername: venueData.xUsername || '',
      xFollowers: venueData.xFollowers || undefined,
      xCreatedAt: venueData.xCreatedAt
        ? format(new Date(venueData.xCreatedAt), 'yyyy-MM-dd')
        : undefined,
    }),
    [venueData],
  );

  const methods = useForm({
    resolver: zodResolver(venueS3FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  const onSubmit = async (data: VenueS3FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    const response = await updateVenueSocialData(venueData.id, data);

    if (response.success) {
      methods.reset(data); // new form status, isDirty to false
      toast.success('Scheda locale aggiornata!');
      closeDialog();
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4 p-2'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <StepThree />

        <div className='flex justify-between mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
            variant='ghost'
            className='text-destructive'
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
