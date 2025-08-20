'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArtistManagerFormSchema, artistManagerS1FormSchema, artistManagerS2FormSchema, artistManagerS3FormSchema, artistManagerFormSchema } from '@/lib/validation/artistManagerFormSchema';
import { useState } from 'react';
import StepOne from '../form/StepOne';
import StepTwo from '../form/StepTwo';
import { toast } from 'sonner';
import StepThree from '../form/StepThree';
import { ArrowLeft } from 'lucide-react';
import { Country, Language } from '@/lib/types';
import StepIndicator from '@/app/(private)/_components/form/StepIndicator';
import { Button } from '@/components/ui/button';
import { createArtistManager } from '@/lib/server-actions/artist-managers/create-artist-manager';
import { useRouter } from 'next/navigation';

function getFormFieldsForStep(step: number): Array<keyof ArtistManagerFormSchema> {
  if (step === 1) {
    return Object.keys(artistManagerS1FormSchema.shape) as Array<keyof ArtistManagerFormSchema>;
  }
  if (step === 2) {
    return Object.keys(artistManagerS2FormSchema.shape) as Array<keyof ArtistManagerFormSchema>;
  }
  if (step === 3) {
    return Object.keys(artistManagerS3FormSchema.shape) as Array<keyof ArtistManagerFormSchema>;
  }
  return [];
}

export default function CreateArtistManagerForm({ languages, countries, closeDialog }: { languages: Language[]; countries: Country[]; closeDialog: () => void }) {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const methods = useForm({
    resolver: zodResolver(artistManagerFormSchema),
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

      company: '',
      taxCode: '',
      ipiCode: '',
      bicCode: undefined,
      abaRoutingNumber: undefined,
      iban: '',
      sdiRecipientCode: undefined,
      billingAddress: '',
      billingCountry: undefined,
      billingSubdivisionId: 0,
      billingCity: '',
      billingZipCode: '',
      billingEmail: '',
      billingPhone: '',
      billingPec: '',
      taxableInvoice: 'false',

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

  const onSubmit = async (data: ArtistManagerFormSchema) => {
    setIsLoading(true);
    const response = await createArtistManager(data);

    if (response.success) {
      toast.success('Utenza manager artisti creata!');
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
      <section className='grid grid-cols-5 justify-items-center gap-4 bg-zinc-50 p-4 rounded-xl'>
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
          <div className='text-xs font-semibold text-center'>Dati aziendali</div>
        </div>
        <div className='h-1 w-full self-center bg-zinc-100 rounded-xl'></div>
        {/* step 3 */}
        <div className='flex flex-col items-center gap-2'>
          <StepIndicator
            step={3}
            currentStep={step}
          />
          <div className='text-[10px] font-medium text-zinc-400'>FASE 3</div>
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
            {step === 2 && <StepTwo countries={countries} />}
            {step === 3 && <StepThree />}

            <div className={`flex ${step > 1 ? 'justify-between' : 'justify-end'} mt-4`}>
              {step > 1 && (
                <div
                  onClick={onPrev}
                  className='w-full md:w-auto flex justify-center items-center gap-2 h-10 text-zinc-500 p-3 rounded-xl hover:cursor-pointer hover:bg-slate-50'
                >
                  <ArrowLeft size={16} /> Indietro
                </div>
              )}
              {step < 3 ? (
                <div
                  onClick={onNext}
                  className='w-full md:w-auto flex justify-center items-center h-10 bg-primary text-white p-3 rounded-xl hover:cursor-pointer hover:bg-primary/90'
                >
                  Continua
                </div>
              ) : (
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full md:w-auto'
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
