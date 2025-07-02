import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn, fetcher } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArtistsManagerData, Country, Subdivision } from '@/lib/types';
import useSWR from 'swr';
import { toast } from 'sonner';
import {
  ArtistManagerS2FormSchema,
  artistManagerFormS2Schema,
} from '@/lib/validation/artistManagerFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { editArtistManagerBillingData } from '@/lib/server-actions/artist-manager/edit-artist-manager-billing-data';
import { X } from 'lucide-react';

export default function BillingDataForm({
  userData,
  countries,
  onCancel,
}: {
  userData: ArtistsManagerData;
  countries: Country[];
  onCancel: () => void;
}) {
  const methods = useForm({
    resolver: zodResolver(artistManagerFormS2Schema),
    defaultValues: {
      company: userData.company || '',
      taxCode: userData.taxCode || '',
      ipiCode: userData.ipiCode || '',
      bicCode: userData.bicCode || '',
      abaRoutingNumber: userData.abaRoutingNumber || '',
      iban: userData.iban || '',
      sdiRecipientCode: userData.sdiRecipientCode || '',
      billingAddress: userData.billingAddress || '',
      billingCountryId: userData.billingCountryId || 0,
      billingSubdivisionId: userData.billingSubdivisionId || 0,
      billingCity: userData.billingCity || '',
      billingZipCode: userData.billingZipCode || '',
      billingEmail: userData.billingEmail || '',
      billingPhone: userData.billingPhone || '',
      billingPec: userData.billingPec || '',
      taxableInvoice: userData.taxableInvoice.toString() || 'false',
    },
  });
  const router = useRouter();

  const {
    register,
    control,
    formState: { isDirty, errors },
  } = methods;

  const selectedCountryId = methods.watch('billingCountryId');

  // Reset billingSubdivision when selectedBillingCountryId changes
  useEffect(() => {
    if (!selectedCountryId) return;
    methods.resetField('billingSubdivisionId');
  }, [selectedCountryId, methods]);

  const { data, error } = useSWR(
    selectedCountryId
      ? `/api/country-subdivisions?country=${selectedCountryId}`
      : null,
    fetcher
  );

  const subdivisions: Subdivision[] = data?.subdivisions ?? [];

  if (error) {
    toast.error('Recupero delle province fatturazione non riuscito.');
  }

  const onSubmit = async (data: ArtistManagerS2FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }

    const response = await editArtistManagerBillingData({
      profileId: userData.profileId,
      data: data,
    });

    if (response.success) {
      toast.success('Profilo manager artisti aggiornato!');
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col'>
          <label
            htmlFor='company'
            className='block text-sm font-semibold mb-2'
          >
            Ragione sociale
          </label>
          <Input
            id='company'
            {...register('company')}
            placeholder='Milano Ovest'
            className={
              errors.company ? 'border-destructive text-destructive' : ''
            }
          />
          {errors.company && (
            <p className='text-xs text-destructive mt-2'>
              {errors.company.message as string}
            </p>
          )}
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <label
              htmlFor='taxCode'
              className='block text-sm font-semibold mb-2'
            >
              Codice fiscale
            </label>
            <Input
              id='taxCode'
              {...register('taxCode', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              placeholder='AAAAAAAAAA1234'
              className={
                errors.taxCode ? 'border-destructive text-destructive' : ''
              }
            />
            {errors.taxCode && (
              <p className='text-xs text-destructive mt-2'>
                {errors.taxCode.message as string}
              </p>
            )}
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='ipiCode'
              className='block text-sm font-semibold mb-2'
            >
              Codice IPI
            </label>
            <Input
              id='ipiCode'
              placeholder='123456789'
              inputMode='numeric'
              {...register('ipiCode', {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                },
              })}
              className={
                errors.ipiCode ? 'border-destructive text-destructive' : ''
              }
            />
            {errors.ipiCode && (
              <p className='text-xs text-destructive mt-2'>
                {errors.ipiCode.message as string}
              </p>
            )}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <label
              htmlFor='bicCode'
              className='block text-sm font-semibold mb-2'
            >
              Codice BIC
            </label>
            <Input
              id='bicCode'
              {...register('bicCode', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              placeholder='AAAA1234'
              className={
                errors.bicCode ? 'border-destructive text-destructive' : ''
              }
            />
            {errors.bicCode && (
              <p className='text-xs text-destructive mt-2'>
                {errors.bicCode.message as string}
              </p>
            )}
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='abaRoutingNumber'
              className='block text-sm font-semibold mb-2'
            >
              Numero di Routing ABA
            </label>
            <Input
              id='abaRoutingNumber'
              inputMode='numeric'
              {...register('abaRoutingNumber', {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                },
              })}
              placeholder='123456789'
              className={
                errors.abaRoutingNumber
                  ? 'border-destructive text-destructive'
                  : ''
              }
            />
            {errors.abaRoutingNumber && (
              <p className='text-xs text-destructive mt-2'>
                {errors.abaRoutingNumber.message as string}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='iban'
            className='block text-sm font-semibold mb-2'
          >
            IBAN
          </label>
          <Input
            id='iban'
            {...register('iban', {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
            placeholder='IT0000000000000000'
            className={errors.iban ? 'border-destructive text-destructive' : ''}
          />
          {errors.iban && (
            <p className='text-xs text-destructive mt-2'>
              {errors.iban.message as string}
            </p>
          )}
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='sdiRecipientCode'
            className='block text-sm font-semibold mb-2'
          >
            Codice destinatario SDI
          </label>
          <Input
            id='sdiRecipientCode'
            {...register('sdiRecipientCode', {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
            placeholder='ABC1234'
            className={
              errors.sdiRecipientCode
                ? 'border-destructive text-destructive'
                : ''
            }
          />
          {errors.sdiRecipientCode && (
            <p className='text-xs text-destructive mt-2'>
              {errors.sdiRecipientCode.message as string}
            </p>
          )}
        </div>
        <Separator className='my-4' />
        <div className='flex flex-col'>
          <label
            htmlFor='billingAddress'
            className='block text-sm font-semibold mb-2'
          >
            Indirizzo di fatturazione
          </label>
          <Input
            id='billingAddress'
            {...register('billingAddress')}
            placeholder='Via Duomo 1'
            className={
              errors.billingAddress ? 'border-destructive text-destructive' : ''
            }
          />
          {errors.billingAddress && (
            <p className='text-xs text-destructive mt-2'>
              {errors.billingAddress.message as string}
            </p>
          )}
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <label
              htmlFor='billingCountryId'
              className='block text-sm font-semibold mb-2'
            >
              Stato fatturazione
            </label>
            <Controller
              control={control}
              name='billingCountryId'
              render={({ field }) => (
                <Select
                  name='billingCountryId'
                  value={field.value.toString()}
                  onValueChange={(v) => field.onChange(parseInt(v))}
                >
                  <SelectTrigger
                    className={cn(
                      'w-full',
                      errors.billingCountryId &&
                        'border-destructive text-destructive'
                    )}
                    size='sm'
                  >
                    {countries.find((c) => c.id == field.value)?.name ||
                      'Seleziona uno stato'}
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.id}
                        value={country.id.toString()}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.billingCountryId && (
              <p className='text-xs text-destructive mt-2'>
                {errors.billingCountryId.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <label
              htmlFor='billingSubdivisionId'
              className='block text-sm font-semibold mb-2'
            >
              Provincia fatturazione
            </label>
            <Controller
              control={control}
              name='billingSubdivisionId'
              render={({ field }) => (
                <Select
                  name='billingSubdivisionId'
                  value={field.value.toString()}
                  disabled={!selectedCountryId}
                  onValueChange={(v) => field.onChange(parseInt(v))}
                >
                  <SelectTrigger
                    className={cn(
                      'w-full',
                      errors.billingSubdivisionId &&
                        'border-destructive text-destructive'
                    )}
                    size='sm'
                  >
                    {subdivisions.find((s) => s.id == field.value)?.name ||
                      (selectedCountryId
                        ? 'Seleziona una provincia'
                        : 'Seleziona uno stato')}
                  </SelectTrigger>
                  <SelectContent>
                    {subdivisions.map((subdivision: Subdivision) => (
                      <SelectItem
                        key={subdivision.id}
                        value={subdivision.id.toString()}
                      >
                        {subdivision.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.billingSubdivisionId && (
              <p className='text-xs text-destructive mt-2'>
                {errors.billingSubdivisionId.message as string}
              </p>
            )}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <label
              htmlFor='billingCity'
              className='block text-sm font-semibold mb-2'
            >
              Comune fatturazione
            </label>
            <Input
              id='billingCity'
              {...register('billingCity')}
              placeholder='Milano'
              className={
                errors.billingCity ? 'border-destructive text-destructive' : ''
              }
            />
            {errors.billingCity && (
              <p className='text-xs text-destructive mt-2'>
                {errors.billingCity.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <label
              htmlFor='billingZipCode'
              className='block text-sm font-semibold mb-2'
            >
              CAP
            </label>
            <Input
              id='billingZipCode'
              {...register('billingZipCode', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              placeholder='20100'
              className={
                errors.billingZipCode
                  ? 'border-destructive text-destructive'
                  : ''
              }
            />
            {errors.billingZipCode && (
              <p className='text-xs text-destructive mt-2'>
                {errors.billingZipCode.message as string}
              </p>
            )}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <label
              htmlFor='billingEmail'
              className='block text-sm font-semibold mb-2'
            >
              Email fatturazione
            </label>
            <Input
              id='billingEmail'
              type='email'
              {...register('billingEmail')}
              placeholder='fatturazione@eaglebooking.it'
              className={
                errors.billingEmail ? 'border-destructive text-destructive' : ''
              }
            />
            {errors.billingEmail && (
              <p className='text-xs text-destructive mt-2'>
                {errors.billingEmail.message as string}
              </p>
            )}
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='billingPhone'
              className='block text-sm font-semibold mb-2'
            >
              Telefono fatturazione
            </label>
            <Input
              id='billingPhone'
              {...register('billingPhone')}
              placeholder='+39 123456789'
              className={
                errors.billingPhone ? 'border-destructive text-destructive' : ''
              }
              autoComplete='tel'
            />
            {errors.billingPhone && (
              <p className='text-xs text-destructive mt-2'>
                {errors.billingPhone.message as string}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='billingPec'
            className='block text-sm font-semibold mb-2'
          >
            Indirizzo PEC
          </label>
          <Input
            id='billingPec'
            {...register('billingPec')}
            placeholder='Milano Ovest'
            className={
              errors.billingPec ? 'border-destructive text-destructive' : ''
            }
          />
          {errors.billingPec && (
            <p className='text-xs text-destructive mt-2'>
              {errors.billingPec.message as string}
            </p>
          )}
        </div>
        <Separator className='my-4' />
        <div className='flex flex-col'>
          <label
            htmlFor='taxableInvoice'
            className='block text-sm font-semibold mb-2'
          >
            Riporta imponibile in fattura
          </label>
          <Controller
            control={control}
            name='taxableInvoice'
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                className='flex gap-2'
              >
                <label
                  className={cn(
                    'h-10 flex items-center gap-2 text-sm p-2 rounded-xl border hover:cursor-pointer',
                    errors.taxableInvoice &&
                      'border-destructive text-destructive'
                  )}
                >
                  <RadioGroupItem value={'true'} />
                  Sì
                </label>
                <label
                  className={cn(
                    'h-10 flex items-center gap-2 text-sm p-2 rounded-xl border hover:cursor-pointer',
                    errors.taxableInvoice &&
                      'border-destructive text-destructive'
                  )}
                >
                  <RadioGroupItem value={'false'} />
                  No
                </label>
              </RadioGroup>
            )}
          />
          {errors.taxableInvoice && (
            <p className='text-xs text-destructive mt-2'>
              {errors.taxableInvoice.message as string}
            </p>
          )}
        </div>
        <div className='flex justify-between mt-4'>
          <div
            onClick={onCancel}
            className='flex justify-center items-center gap-2 h-10 text-destructive p-3 rounded-xl hover:cursor-pointer hover:bg-slate-50'
          >
            <X size={16} /> Annulla
          </div>

          <Button type='submit'>Continua</Button>
        </div>
      </form>
    </FormProvider>
  );
}
