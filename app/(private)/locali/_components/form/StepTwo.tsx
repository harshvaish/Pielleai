'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import AddressAutocompleteInput, {
  type AddressDetails,
} from '@/components/forms/AddressAutocompleteInput';
import { Separator } from '@/components/ui/separator';
import { cn, fetcher } from '@/lib/utils';
import { applyBillingAddressDetails } from '@/lib/utils/address-details';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Country, Subdivision } from '@/lib/types';
import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { VenueS2FormSchema } from '@/lib/validation/venue-form-schema';

type StepTwoProps = {
  countries: Country[];
};

export default function StepTwo({ countries }: StepTwoProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<VenueS2FormSchema>();

  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);

  const selectedCountry = watch('billingCountry');
  const selectedSubdivisionId = watch('billingSubdivisionId');
  const selectedCountryCode = selectedCountry?.code?.toLowerCase() || 'it';

  const isEU = selectedCountry?.isEu;
  const isUSA = selectedCountry?.code === 'US';
  const isITA = selectedCountry?.code === 'IT';

  const { data: response, isLoading } = useSWR(
    selectedCountry && selectedCountry.id
      ? `/api/country-subdivisions?c=${selectedCountry.id}`
      : null,
    fetcher,
  );

  const subdivisionPlaceholder = useMemo(() => {
    if (isLoading) return 'Caricamento province...';
    if (!selectedCountry) return 'seleziona stato';
    return 'seleziona provincia';
  }, [isLoading, selectedCountry]);

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      toast.error(response.message || 'Recupero province non riuscito.');
      return;
    }

    if (response.data && response.data.length > 0) {
      setSubdivisions(response.data);
    }
  }, [response]);

  useEffect(() => {
    if (!selectedCountry) return;
    if (isEU) {
      setValue('bicCode', undefined);
    }
    if (!isUSA) {
      setValue('abaRoutingNumber', undefined);
    }
    if (!isITA) {
      setValue('sdiRecipientCode', undefined);
    }
  }, [setValue, selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || isLoading || !subdivisions.length) return;

    const isValid = subdivisions.some((sub) => sub.id === selectedSubdivisionId);

    if (!isValid) {
      setValue('billingSubdivisionId', 0);
    }
  }, [selectedCountry, selectedSubdivisionId, subdivisions, isLoading, setValue]);

  const handleBillingAddressDetails = (details: AddressDetails) => {
    applyBillingAddressDetails(setValue, details);

    if (details.countryCode) {
      const match = countries.find(
        (country) => country.code.toLowerCase() === details.countryCode?.toLowerCase(),
      );
      if (match) {
        setValue('billingCountry', match, { shouldDirty: true, shouldTouch: true });
      }
    }
  };

  return (
    <>
      <div className='flex flex-col'>
        <label
          htmlFor='billingAddress'
          className='block text-sm font-semibold mb-2'
        >
          Sede legale
        </label>
        <Controller
          control={control}
          name='billingAddress'
          render={({ field }) => (
            <AddressAutocompleteInput
              id='billingAddress'
              value={field.value ?? ''}
              onValueChange={field.onChange}
              onDetails={handleBillingAddressDetails}
              placeholder='Inserisci sede legale'
              error={errors.billingAddress?.message as string | undefined}
              countryCode={selectedCountryCode}
            />
          )}
        />
        {errors.billingAddress && (
          <p className='text-xs text-destructive mt-2'>{errors.billingAddress.message as string}</p>
        )}
        <input type='hidden' {...register('billingAddressFormatted')} />
        <input type='hidden' {...register('billingStreetName')} />
        <input type='hidden' {...register('billingStreetNumber')} />
        <input type='hidden' {...register('billingPlaceId')} />
        <input type='hidden' {...register('billingLatitude')} />
        <input type='hidden' {...register('billingLongitude')} />
        <input type='hidden' {...register('billingCountryName')} />
        <input type='hidden' {...register('billingCountryCode')} />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label
            htmlFor='billingCountryId'
            className='block text-sm font-semibold mb-2'
          >
            Nazione
          </label>
          <Controller
            control={control}
            name='billingCountry'
            render={({ field }) => (
              <Select
                value={field.value?.id?.toString()}
                onValueChange={(selectedId) => {
                  const selectedCountry = countries.find((c) => c.id === parseInt(selectedId));
                  field.onChange(selectedCountry || null);
                }}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    errors.billingCountry && 'border-destructive text-destructive',
                  )}
                  size='sm'
                >
                  {field.value?.name ?? 'seleziona nazione'}
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.id}
                      value={country.id?.toString()}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.billingCountry && (
            <p className='text-xs text-destructive mt-2'>
              {errors.billingCountry.message as string}
            </p>
          )}
        </div>

        <div className='flex flex-col'>
          <label
            htmlFor='billingSubdivisionId'
            className='block text-sm font-semibold mb-2'
          >
            Provincia di fatturazione
          </label>
          <Controller
            control={control}
            name='billingSubdivisionId'
            render={({ field }) => (
              <Select
                name='billingSubdivisionId'
                value={field.value?.toString()}
                disabled={!selectedCountry || isLoading}
                onValueChange={(v) => field.onChange(parseInt(v))}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    errors.billingSubdivisionId && 'border-destructive text-destructive',
                  )}
                  size='sm'
                >
                  {subdivisions.find((s) => s.id == field.value)?.name || subdivisionPlaceholder}
                </SelectTrigger>
                <SelectContent>
                  {subdivisions.map((subdivision: Subdivision) => (
                    <SelectItem
                      key={subdivision.id}
                      value={subdivision.id?.toString()}
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
            Comune di fatturazione
          </label>
          <Input
            id='billingCity'
            {...register('billingCity')}
            placeholder='Inserisci il comune di fatturazione'
            className={errors.billingCity ? 'border-destructive text-destructive' : ''}
          />
          {errors.billingCity && (
            <p className='text-xs text-destructive mt-2'>{errors.billingCity.message as string}</p>
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
            placeholder='Inserisci il CAP di fatturazione'
            className={errors.billingZipCode ? 'border-destructive text-destructive' : ''}
          />
          {errors.billingZipCode && (
            <p className='text-xs text-destructive mt-2'>
              {errors.billingZipCode.message as string}
            </p>
          )}
        </div>
      </div>

      <Separator className='my-4' />

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
          placeholder='Inserisci la ragione sociale'
          className={errors.company ? 'border-destructive text-destructive' : ''}
        />
        {errors.company && (
          <p className='text-xs text-destructive mt-2'>{errors.company.message as string}</p>
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
            placeholder='Inserisci il codice fiscale'
            className={errors.taxCode ? 'border-destructive text-destructive' : ''}
          />
          {errors.taxCode && (
            <p className='text-xs text-destructive mt-2'>{errors.taxCode.message as string}</p>
          )}
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='vatCode'
            className='block text-sm font-semibold mb-2'
          >
            Partita IVA
          </label>
          <Input
            id='vatCode'
            placeholder='Inserisci la partita IVA'
            inputMode='numeric'
            {...register('vatCode', {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
              },
            })}
            className={errors.vatCode ? 'border-destructive text-destructive' : ''}
          />
          {errors.vatCode && (
            <p className='text-xs text-destructive mt-2'>{errors.vatCode.message as string}</p>
          )}
        </div>
      </div>

      <Separator className='my-4' />

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label
            htmlFor='billingEmail'
            className='block text-sm font-semibold mb-2'
          >
            Email di fatturazione
          </label>
          <Input
            id='billingEmail'
            type='email'
            {...register('billingEmail')}
            placeholder="Inserisci l'email di fatturazione"
            className={errors.billingEmail ? 'border-destructive text-destructive' : ''}
          />
          {errors.billingEmail && (
            <p className='text-xs text-destructive mt-2'>{errors.billingEmail.message as string}</p>
          )}
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='billingPhone'
            className='block text-sm font-semibold mb-2'
          >
            Telefono di fatturazione
          </label>
          <Input
            id='billingPhone'
            {...register('billingPhone')}
            placeholder='Inserisci il numero di telefono di fatturazione, es. +39 0123456789'
            className={errors.billingPhone ? 'border-destructive text-destructive' : ''}
            autoComplete='tel'
          />
          {errors.billingPhone && (
            <p className='text-xs text-destructive mt-2'>{errors.billingPhone.message as string}</p>
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
          placeholder="Inserisci l'indirizzo PEC"
          className={errors.billingPec ? 'border-destructive text-destructive' : ''}
        />
        {errors.billingPec && (
          <p className='text-xs text-destructive mt-2'>{errors.billingPec.message as string}</p>
        )}
      </div>
      {isITA && (
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
            placeholder='Inserisci il codice destinatario SDI'
            className={errors.sdiRecipientCode ? 'border-destructive text-destructive' : ''}
          />
          {errors.sdiRecipientCode && (
            <p className='text-xs text-destructive mt-2'>
              {errors.sdiRecipientCode.message as string}
            </p>
          )}
        </div>
      )}
      {!isEU && (
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
            placeholder='Inserisci il codice BIC'
            className={errors.bicCode ? 'border-destructive text-destructive' : ''}
          />
          {errors.bicCode && (
            <p className='text-xs text-destructive mt-2'>{errors.bicCode.message as string}</p>
          )}
        </div>
      )}
      {isUSA && (
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
            placeholder='Inserisci il numero di Routing ABA'
            className={errors.abaRoutingNumber ? 'border-destructive text-destructive' : ''}
          />
          {errors.abaRoutingNumber && (
            <p className='text-xs text-destructive mt-2'>
              {errors.abaRoutingNumber.message as string}
            </p>
          )}
        </div>
      )}
    </>
  );
}
