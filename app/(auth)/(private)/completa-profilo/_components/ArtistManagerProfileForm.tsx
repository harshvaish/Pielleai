'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  artistManagerS1FormSchema,
  ArtistManagerProfileFormSchema,
  artistManagerProfileFormSchema,
} from '@/lib/validation/artist-manager-form-schema';
import { MouseEvent, useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Country, Language } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import StepOne from '@/app/(private)/manager-artisti/_components/form/StepOne';
import StepTwo from '@/app/(private)/manager-artisti/_components/form/StepTwo';
import { createArtistManagerProfile } from '@/lib/server-actions/artist-managers/create-artist-manager-profile';
import SignOutButton from '@/app/_components/SignOutButton';

type ArtistManagerProfileFormProps = {
  uid: string;
  languages: Language[];
  countries: Country[];
};

export default function ArtistManagerProfileForm({
  uid,
  languages,
  countries,
}: ArtistManagerProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const methods = useForm({
    resolver: zodResolver(artistManagerProfileFormSchema),
    defaultValues: {
      avatarUrl: undefined,
      name: '',
      surname: '',
      phone: '',
      birthDate: '',
      birthPlace: '',
      languages: [],
      address: '',
      addressFormatted: '',
      streetName: '',
      streetNumber: '',
      placeId: '',
      latitude: undefined,
      longitude: undefined,
      countryName: '',
      countryCode: '',
      countryId: 0,
      subdivisionId: 0,
      city: '',
      zipCode: '',
      gender: 'male',

      company: '',
      taxCode: '',
      ipiCode: '',
      bicCode: undefined,
      abaRoutingNumber: undefined,
      iban: '',
      sdiRecipientCode: undefined,
      billingAddress: '',
      billingAddressFormatted: '',
      billingStreetName: '',
      billingStreetNumber: '',
      billingPlaceId: '',
      billingLatitude: undefined,
      billingLongitude: undefined,
      billingCountryName: '',
      billingCountryCode: '',
      billingCountry: undefined,
      billingSubdivisionId: 0,
      billingCity: '',
      billingZipCode: '',
      billingEmail: '',
      billingPhone: '',
      billingPec: '',
      taxableInvoice: 'false',
    },
  });

  const router = useRouter();

  const onNext = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const fields = Object.keys(artistManagerS1FormSchema.shape) as Array<
      keyof ArtistManagerProfileFormSchema
    >;

    const isValid = await methods.trigger(fields);
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      toast.error('Alcuni campi sono incompleti o errati');
    }
  };

  const onPrev = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: ArtistManagerProfileFormSchema) => {
    startTransition(async () => {
      const response = await createArtistManagerProfile(uid, data);

      if (response.success) {
        startTransition(async () => router.replace('/attesa-approvazione'));
      } else {
        toast.error(response.message);
      }
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo?.({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  return (
    <div
      ref={containerRef}
      className='bg-zinc-50 p-1 lg:p-4 border rounded-2xl'
    >
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-4 p-2'
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          {step === 1 && (
            <StepOne
              languages={languages}
              countries={countries}
            />
          )}
          {step === 2 && <StepTwo countries={countries} />}

          <div className={`flex justify-between mt-4`}>
            {step == 1 && <SignOutButton />}
            {step > 1 && (
              <Button
                type='button'
                variant='ghost'
                onClick={onPrev}
              >
                <ArrowLeft className='size-4' /> Indietro
              </Button>
            )}
            {step < 2 ? (
              <Button
                type='button'
                onClick={onNext}
              >
                Continua
              </Button>
            ) : (
              <Button
                type='submit'
                disabled={isPending}
                className='w-full md:w-auto'
              >
                {isPending ? 'Creazione profilo...' : 'Conferma'}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
