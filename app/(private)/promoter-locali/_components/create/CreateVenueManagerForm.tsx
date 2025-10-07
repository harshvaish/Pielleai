'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  venueManagerFormSchema,
  VenueManagerFormSchema,
  venueManagerS1FormSchema,
  venueManagerS2FormSchema,
} from '@/lib/validation/venue-manager-form-schema';
import { MouseEvent, useEffect, useRef, useState, useTransition } from 'react';
import StepOne from '../form/StepOne';
import { toast } from 'sonner';
import StepTwo from '../form/StepTwo';
import { ArrowLeft } from 'lucide-react';
import { Country, Language } from '@/lib/types';
import StepIndicator from '@/app/(private)/_components/form/StepIndicator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createVenueManager } from '@/lib/server-actions/venue-managers/create-venue-manager';

function getFormFieldsForStep(step: number): Array<keyof VenueManagerFormSchema> {
  if (step === 1) {
    return Object.keys(venueManagerS1FormSchema.shape) as Array<keyof VenueManagerFormSchema>;
  }
  if (step === 2) {
    return Object.keys(venueManagerS2FormSchema.shape) as Array<keyof VenueManagerFormSchema>;
  }
  return [];
}

type CreateVenueManagerFormProps = {
  languages: Language[];
  countries: Country[];
  closeDialog: () => void;
};

export default function CreateVenueManagerForm({
  languages,
  countries,
  closeDialog,
}: CreateVenueManagerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const methods = useForm({
    resolver: zodResolver(venueManagerFormSchema),
    defaultValues: {
      avatarUrl: undefined,
      name: '',
      surname: '',
      phone: '',
      birthDate: '',
      birthPlace: '',
      languages: [],
      address: '',
      countryId: 0,
      subdivisionId: 0,
      city: '',
      zipCode: '',
      gender: 'male',

      signUpEmail: '',
      signUpPassword: '',
    },
  });

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

  const onSubmit = async (data: VenueManagerFormSchema) => {
    startTransition(async () => {
      const response = await createVenueManager(data);

      if (response.success) {
        closeDialog();
        toast.success('Utenza promoter locali creata!');
        startTransition(async () => router.refresh());
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
    <>
      {/* step section */}
      <section className='grid grid-cols-3 justify-items-center gap-4 bg-zinc-50 p-4 rounded-xl'>
        {/* step 1 */}
        <div className='flex flex-col items-center gap-2'>
          <StepIndicator
            step={1}
            currentStep={step}
          />

          <div className='text-[10px] font-medium text-zinc-400'>FASE 1</div>
          <div className='text-xs font-semibold text-center'>Dati personali</div>
        </div>

        <div className='h-1 w-full self-center bg-zinc-100 rounded-xl'></div>

        {/* step 2 */}
        <div className='flex flex-col items-center gap-2'>
          <StepIndicator
            step={2}
            currentStep={step}
          />

          <div className='text-[10px] font-medium text-zinc-400'>FASE 2</div>
          <div className='text-xs font-semibold text-center'>Credenziali</div>
        </div>
      </section>

      {/* tab section */}
      <section
        ref={containerRef}
        className='max-h-full overflow-y-auto'
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
            {step === 2 && <StepTwo />}

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
                  {isPending ? 'Creazione utente...' : 'Crea utente'}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
}
