'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { ArtistData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { ArtistS3FormSchema, artistS3FormSchema } from '@/lib/validation/artist-form-schema';
import { format } from 'date-fns';
import { updateArtistSocialData } from '@/lib/server-actions/artists/update-artist-social-data';
import StepThree from '@/app/(private)/artisti/_components/form/StepThree';

type SocialDataFormProps = { userData: ArtistData; closeDialog: () => void };

export default function SocialDataForm({ userData, closeDialog }: SocialDataFormProps) {
  const defaultValues = useMemo(
    () => ({
      tiktokUrl: userData.tiktokUrl || '',
      tiktokUsername: userData.tiktokUsername || '',
      tiktokFollowers: userData.tiktokFollowers || undefined,
      tiktokCreatedAt: userData.tiktokCreatedAt
        ? format(new Date(userData.tiktokCreatedAt), 'yyyy-MM-dd')
        : undefined,

      facebookUrl: userData.facebookUrl || '',
      facebookUsername: userData.facebookUsername || '',
      facebookFollowers: userData.facebookFollowers || undefined,
      facebookCreatedAt: userData.facebookCreatedAt
        ? format(new Date(userData.facebookCreatedAt), 'yyyy-MM-dd')
        : undefined,

      instagramUrl: userData.instagramUrl || '',
      instagramUsername: userData.instagramUsername || '',
      instagramFollowers: userData.instagramFollowers || undefined,
      instagramCreatedAt: userData.instagramCreatedAt
        ? format(new Date(userData.instagramCreatedAt), 'yyyy-MM-dd')
        : undefined,

      xUrl: userData.xUrl || '',
      xUsername: userData.xUsername || '',
      xFollowers: userData.xFollowers || undefined,
      xCreatedAt: userData.xCreatedAt
        ? format(new Date(userData.xCreatedAt), 'yyyy-MM-dd')
        : undefined,
    }),
    [userData],
  );

  const methods = useForm({
    resolver: zodResolver(artistS3FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  const onSubmit = async (data: ArtistS3FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    const response = await updateArtistSocialData(userData.id, data);

    if (response.success) {
      methods.reset(data); // new form status, isDirty to false
      toast.success('Profilo artista aggiornato!');
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
