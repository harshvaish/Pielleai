'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Country, Language } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import StepOne from '@/app/(private)/manager-artisti/_components/form/StepOne';
import SignOutButton from '@/app/_components/SignOutButton';
import {
  VenueManagerS1FormSchema,
  venueManagerS1FormSchema,
} from '@/lib/validation/venue-manager-form-schema';
import { createVenueManagerProfile } from '@/lib/server-actions/venue-managers/create-venue-manager-profile';

type VenueManagerProfileFormProps = {
  uid: string;
  languages: Language[];
  countries: Country[];
};

export default function VenueManagerProfileForm({
  uid,
  languages,
  countries,
}: VenueManagerProfileFormProps) {
  const methods = useForm({
    resolver: zodResolver(venueManagerS1FormSchema),
    defaultValues: {
      avatarUrl: undefined,
      name: '',
      surname: '',
      phone: '',
      email: '',
      birthDate: '',
      birthPlace: '',
      languages: [],
      address: '',
      countryId: 0,
      subdivisionId: 0,
      city: '',
      zipCode: '',
      gender: 'male',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: VenueManagerS1FormSchema) => {
    const response = await createVenueManagerProfile(uid, data);

    if (response.success) {
      router.replace('/attesa-approvazione');
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className='bg-zinc-50 p-4 border rounded-2xl'>
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-4'
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <StepOne
            languages={languages}
            countries={countries}
          />

          <div className={`flex justify-between mt-4`}>
            <SignOutButton />

            <Button
              type='submit'
              disabled={methods.formState.isSubmitting}
              className='w-full md:w-auto'
            >
              {methods.formState.isSubmitting ? 'Creazione profilo...' : 'Conferma'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
