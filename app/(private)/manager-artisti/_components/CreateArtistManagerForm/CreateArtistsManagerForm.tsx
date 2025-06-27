'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createArtistsManagerFormS1Schema,
  createArtistsManagerFormS2Schema,
  createArtistsManagerFormS3Schema,
  createArtistsManagerFullFormSchema,
  extendCreateArtistsManagerFormSchema,
} from '@/lib/validation/createArtistsManagerFormSchema';
import { useEffect, useState } from 'react';
import * as z from 'zod/v4';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import { toast } from 'sonner';
import StepThree from './StepThree';
import { ArrowLeft } from 'lucide-react';
import { Country, Language } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import StepIndicator from './StepIndicator';
import { Button } from '@/components/ui/button';
import { createArtistsManager } from '@/lib/server-actions/artists-manager/create-artists-manager';

type CreateArtistsManagerFormData = z.infer<
  typeof createArtistsManagerFullFormSchema
>;

function getFormFieldsForStep(
  step: number
): Array<keyof CreateArtistsManagerFormData> {
  if (step === 1) {
    return Object.keys(createArtistsManagerFormS1Schema.shape) as Array<
      keyof CreateArtistsManagerFormData
    >;
  }
  if (step === 2) {
    return Object.keys(createArtistsManagerFormS2Schema.shape) as Array<
      keyof CreateArtistsManagerFormData
    >;
  }
  if (step === 3) {
    return Object.keys(createArtistsManagerFormS3Schema.shape) as Array<
      keyof CreateArtistsManagerFormData
    >;
  }
  return [];
}

export default function CreateArtistsManagerForm({
  languages,
  countries,
}: {
  languages: Language[];
  countries: Country[];
}) {
  const [step, setStep] = useState<number>(1);
  const formSchema = extendCreateArtistsManagerFormSchema(languages, countries);
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
      countryId: undefined,
      subdivisionId: undefined,
      city: '',
      zipCode: '',
      gender: undefined,

      company: '',
      taxCode: '',
      ipiCode: '',
      bicCode: '',
      abaRoutingNumber: '',
      iban: '',
      sdiRecipientCode: '',
      billingAddress: '',
      billingCountryId: undefined,
      billingSubdivisionId: undefined,
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

  const onNext = async () => {
    const result = await methods.trigger(getFormFieldsForStep(step));
    if (result) {
      setStep((prev) => prev + 1);
    } else {
      toast.error('Alcuni campi sono incompleti o errati');
    }
  };

  const onPrev = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.success('Valid form data');
    console.dir(data, { depths: 0 });
    const response = await createArtistsManager(data);

    if (response.success) {
      toast.success('User registered');
    } else {
      toast.error(response.message);
    }
  };

  const selectedCountryId = methods.watch('countryId');
  const selectedBillingCountryId = methods.watch('billingCountryId');

  // Reset subdivision when selectedCountryId changes
  useEffect(() => {
    if (!selectedCountryId) return;
    methods.resetField('subdivisionId');
  }, [selectedCountryId, methods]);

  // Reset billingSubdivision when selectedBillingCountryId changes
  useEffect(() => {
    if (!selectedBillingCountryId) return;
    methods.resetField('billingSubdivisionId');
  }, [selectedBillingCountryId, methods]);

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
          <div className='text-xs font-semibold text-center'>
            Dati aziendali
          </div>
        </div>
        <Separator className='self-center' />
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
              {step < 3 ? (
                <div
                  onClick={onNext}
                  className='flex justify-center items-center h-10 bg-primary text-white p-3 rounded-xl hover:cursor-pointer hover:bg-primary/90'
                >
                  Continua
                </div>
              ) : (
                <Button type='submit'>Crea utente</Button>
              )}
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
}
