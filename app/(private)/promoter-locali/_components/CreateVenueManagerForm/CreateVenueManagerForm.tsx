'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  venueManagerFormSchema,
  VenueManagerFormSchema,
  venueManagerS1FormSchema,
  venueManagerS2FormSchema,
} from '@/lib/validation/venueManagerFormSchema';
import { useState } from 'react';
import StepOne from './StepOne';
import { toast } from 'sonner';
import StepTwo from './StepTwo';
import { ArrowLeft } from 'lucide-react';
import { Country, Language } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import StepIndicator from '@/app/(private)/_components/StepIndicator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createVenueManager } from '@/lib/server-actions/venue-managers/create-venue-manager';

function getFormFieldsForStep(
  step: number
): Array<keyof VenueManagerFormSchema> {
  if (step === 1) {
    return Object.keys(venueManagerS1FormSchema.shape) as Array<
      keyof VenueManagerFormSchema
    >;
  }
  if (step === 2) {
    return Object.keys(venueManagerS2FormSchema.shape) as Array<
      keyof VenueManagerFormSchema
    >;
  }
  return [];
}

export default function CreateVenueManagerForm({
  languages,
  countries,
  closeDialog,
}: {
  languages: Language[];
  countries: Country[];
  closeDialog: () => void;
}) {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const methods = useForm({
    resolver: zodResolver(venueManagerFormSchema),
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
      gender: 'maschile',

      signUpEmail: '',
      signUpPassword: '',
    },
  });
  const router = useRouter();

  const onNext = async () => {
    const isValid = await methods.trigger(getFormFieldsForStep(step));
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      toast.error('Alcuni campi sono incompleti o errati');
    }
  };

  const onPrev = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: VenueManagerFormSchema) => {
    setIsLoading(true);
    const response = await createVenueManager(data);

    if (response.success) {
      toast.success('Utenza promoter locali creata!');
      router.refresh();
      closeDialog();
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

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
          <div className='text-xs font-semibold text-center'>
            Dati personali
          </div>
        </div>
        <Separator className='self-center' />
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
      <section className='max-h-full overflow-y-auto'>
        <FormProvider {...methods}>
          <form
            className='flex flex-col gap-4'
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {step === 1 && (
              <StepOne
                languages={languages}
                countries={countries}
              />
            )}
            {step === 2 && <StepTwo />}

            <div
              className={`flex ${
                step > 1 ? 'justify-between' : 'justify-end'
              } mt-4`}
            >
              {step > 1 && (
                <div
                  onClick={onPrev}
                  className='flex justify-center items-center gap-2 h-10 text-zinc-500 p-3 rounded-xl hover:cursor-pointer hover:bg-slate-50'
                >
                  <ArrowLeft size={16} /> Indietro
                </div>
              )}
              {step < 2 ? (
                <div
                  onClick={onNext}
                  className='flex justify-center items-center h-10 bg-primary text-white p-3 rounded-xl hover:cursor-pointer hover:bg-primary/90'
                >
                  Continua
                </div>
              ) : (
                <Button
                  type='submit'
                  disabled={isLoading}
                >
                  {isLoading ? 'Creazione utente...' : 'Crea utente'}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
}
