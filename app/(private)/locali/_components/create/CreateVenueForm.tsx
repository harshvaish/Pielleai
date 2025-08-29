'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MouseEvent, useState } from 'react';
import StepOne from '../form/StepOne';
import StepTwo from '../form/StepTwo';
import { toast } from 'sonner';
import StepThree from '../form/StepThree';
import { ArrowLeft } from 'lucide-react';
import { Country, VenueManagerSelectData } from '@/lib/types';
import StepIndicator from '@/app/(private)/_components/form/StepIndicator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  venueFormSchema,
  VenueFormSchema,
  venueS1FormSchema,
  venueS2FormSchema,
  venueS3FormSchema,
} from '@/lib/validation/venue-form-schema';
import { createVenue } from '@/lib/server-actions/venues/create-venue';

function getFormFieldsForStep(step: number): Array<keyof VenueFormSchema> {
  if (step === 1) {
    return Object.keys(venueS1FormSchema.shape) as Array<keyof VenueFormSchema>;
  }
  if (step === 2) {
    return Object.keys(venueS2FormSchema.shape) as Array<keyof VenueFormSchema>;
  }
  if (step === 3) {
    return Object.keys(venueS3FormSchema.shape) as Array<keyof VenueFormSchema>;
  }
  return [];
}

export default function CreateVenueForm({
  countries,
  venueManagers,
  closeDialog,
}: {
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
  closeDialog: () => void;
}) {
  const [step, setStep] = useState<number>(1);
  const methods = useForm({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      avatarUrl: undefined,
      name: '',
      type: 'small',
      capacity: undefined,
      address: '',
      countryId: 0,
      subdivisionId: 0,
      city: '',
      zipCode: '',
      venueManagerId: undefined,

      company: '',
      taxCode: '',
      ipiCode: '',
      bicCode: '',
      abaRoutingNumber: '',
      iban: '',
      sdiRecipientCode: '',
      billingAddress: '',
      billingCountry: undefined,
      billingSubdivisionId: 0,
      billingCity: '',
      billingZipCode: '',
      billingEmail: '',
      billingPhone: '',
      billingPec: '',
      taxableInvoice: 'false',

      tiktokUrl: '',
      tiktokUsername: '',
      tiktokFollowers: undefined,
      tiktokCreatedAt: '',
      facebookUrl: '',
      facebookUsername: '',
      facebookFollowers: undefined,
      facebookCreatedAt: '',
      instagramUrl: '',
      instagramUsername: '',
      instagramFollowers: undefined,
      instagramCreatedAt: '',
      xUrl: '',
      xUsername: '',
      xFollowers: undefined,
      xCreatedAt: '',
    },
  });
  const router = useRouter();

  const onNext = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isValid = await methods.trigger(getFormFieldsForStep(step));
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

  const onSubmit = async (data: VenueFormSchema) => {
    const response = await createVenue(data);

    if (response.success) {
      toast.success('Locale creato!');
      router.refresh();
      closeDialog();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      {/* step section */}
      <section className='grid grid-cols-5 justify-items-center gap-4 bg-zinc-50 p-4 rounded-xl'>
        {/* step 1 */}
        <div className='flex flex-col items-center gap-2'>
          <StepIndicator
            step={1}
            currentStep={step}
          />

          <div className='text-[10px] font-medium text-zinc-400'>FASE 1</div>
          <div className='text-xs font-semibold text-center'>Dati locale</div>
        </div>

        <div className='h-1 w-full self-center bg-zinc-100 rounded-xl'></div>

        {/* step 2 */}
        <div className='flex flex-col items-center gap-2'>
          <StepIndicator
            step={2}
            currentStep={step}
          />

          <div className='text-[10px] font-medium text-zinc-400'>FASE 2</div>
          <div className='text-xs font-semibold text-center'>Dati di fatturazione</div>
        </div>

        <div className='h-1 w-full self-center bg-zinc-100 rounded-xl'></div>

        {/* step 3 */}
        <div className='flex flex-col items-center gap-2'>
          <StepIndicator
            step={3}
            currentStep={step}
          />
          <div className='text-[10px] font-medium text-zinc-400'>FASE 3</div>
          <div className='text-xs font-semibold text-center'>Social</div>
        </div>
      </section>
      {/* tab section */}
      <section className='max-h-full overflow-y-auto'>
        <FormProvider {...methods}>
          <form
            className='flex flex-col gap-4'
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {step === 1 && (
              <StepOne
                countries={countries}
                venueManagers={venueManagers}
              />
            )}
            {step === 2 && <StepTwo countries={countries} />}
            {step === 3 && <StepThree />}

            <div className={`flex ${step > 1 ? 'justify-between' : 'justify-end'} mt-4`}>
              {step > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  onClick={onPrev}
                >
                  <ArrowLeft className='size-4' /> Indietro
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type='button'
                  onClick={onNext}
                >
                  Continua
                </Button>
              ) : (
                <Button
                  type='submit'
                  disabled={methods.formState.isSubmitting}
                  className='w-full md:w-auto'
                >
                  {methods.formState.isSubmitting ? 'Creazione locale...' : 'Crea locale'}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
}
