'use client';

import { useFormContext, Controller } from 'react-hook-form';
import AvatarUploadInput from '@/app/(private)/_components/form/AvatarUploadInput';
import { Input } from '@/components/ui/input';
import AddressAutocompleteInput, {
  type AddressDetails,
} from '@/components/forms/AddressAutocompleteInput';
import { Separator } from '@/components/ui/separator';
import { cn, fetcher } from '@/lib/utils';
import { applyAddressDetails } from '@/lib/utils/address-details';
import LanguagesSelect from '@/app/(private)/_components/form/LanguagesSelect';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSWR from 'swr';
import { Country, Gender, Language, Subdivision } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { profileGenders } from '@/lib/database/schema';
import { GENDERS_LABELS } from '@/lib/constants';
import { ArtistManagerS1FormSchema } from '@/lib/validation/artist-manager-form-schema';

export default function StepOne({
  languages,
  countries,
}: {
  languages: Language[];
  countries: Country[];
}) {
  const {
    register,
    control,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useFormContext<ArtistManagerS1FormSchema>();

  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);

  const selectedCountryId = watch('countryId');
  const selectedSubdivisionId = watch('subdivisionId');

  const { data: response, isLoading } = useSWR(
    selectedCountryId ? `/api/country-subdivisions?c=${selectedCountryId}` : null,
    fetcher,
  );

  const subdivisionPlaceholder = useMemo(() => {
    if (isLoading) return 'Caricamento province...';
    if (!selectedCountryId) return 'Seleziona stato';
    return 'Seleziona provincia';
  }, [isLoading, selectedCountryId]);

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
    if (!selectedCountryId || isLoading || !subdivisions.length) return;

    const isValid = subdivisions.some((sub) => sub.id === selectedSubdivisionId);

    if (!isValid) {
      resetField('subdivisionId', { defaultValue: 0 });
    }
  }, [selectedCountryId, selectedSubdivisionId, subdivisions, isLoading, resetField]);

  const handleAddressDetails = (details: AddressDetails) => {
    applyAddressDetails(setValue, details);

    if (details.countryCode) {
      const match = countries.find(
        (country) => country.code.toLowerCase() === details.countryCode?.toLowerCase(),
      );
      if (match) {
        setValue('countryId', match.id, { shouldDirty: true, shouldTouch: true });
      }
    }
  };

  return (
    <>
      <div className='grid grid-cols-[auto_1fr_1fr] items-end gap-4'>
        <div className='flex flex-col'>
          <Controller
            control={control}
            name='avatarUrl'
            render={({ field }) => (
              <AvatarUploadInput
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.avatarUrl}
                onDelete={() => setValue('avatarUrl', undefined, { shouldDirty: true })}
              />
            )}
          />
          {errors.avatarUrl && (
            <p className='text-xs text-destructive mt-2'>{errors.avatarUrl.message as string}</p>
          )}
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='name'
            className='block text-sm font-semibold mb-2'
          >
            Nome
          </label>
          <Input
            id='name'
            {...register('name')}
            placeholder='Inserisci il nome'
            className={errors.name ? 'border-destructive text-destructive' : ''}
            autoComplete='name'
          />
          {errors.name && (
            <p className='text-xs text-destructive mt-2'>{errors.name.message as string}</p>
          )}
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='surname'
            className='block text-sm font-semibold mb-2'
          >
            Cognome
          </label>
          <Input
            id='surname'
            {...register('surname')}
            placeholder='Inserisci il cognome'
            className={errors.surname ? 'border-destructive text-destructive' : ''}
            autoComplete='family-name'
          />
          {errors.surname && (
            <p className='text-xs text-destructive mt-2'>{errors.surname.message as string}</p>
          )}
        </div>
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='phone'
          className='block text-sm font-semibold mb-2'
        >
          Numero di telefono
        </label>
        <Input
          id='phone'
          {...register('phone')}
          placeholder='Inserisci il numero di telefono es. +39 0123456789'
          className={errors.phone ? 'border-destructive text-destructive' : ''}
          autoComplete='tel'
        />
        {errors.phone && (
          <p className='text-xs text-destructive mt-2'>{errors.phone.message as string}</p>
        )}
      </div>

      <Separator className='my-4' />

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label
            htmlFor='birthDate'
            className='block text-sm font-semibold mb-2'
          >
            Data di nascita
          </label>
          <Controller
            control={control}
            name='birthDate'
            render={({ field }) => (
              <Input
                id='birthDate'
                className={cn(
                  'block w-full',
                  errors.birthDate && 'border-destructive text-destructive',
                )}
                type='date'
                {...field}
              />
            )}
          />
          {errors.birthDate && (
            <p className='text-xs text-destructive mt-2'>{errors.birthDate.message as string}</p>
          )}
        </div>

        <div className='flex flex-col'>
          <label
            htmlFor='birthPlace'
            className='block text-sm font-semibold mb-2'
          >
            Luogo di nascita
          </label>
          <Input
            id='birthPlace'
            {...register('birthPlace')}
            placeholder='Inserisci il luogo di nascita'
            className={errors.birthPlace ? 'border-destructive text-destructive' : ''}
          />
          {errors.birthPlace && (
            <p className='text-xs text-destructive mt-2'>{errors.birthPlace.message as string}</p>
          )}
        </div>
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='languages'
          className='block text-sm font-semibold mb-2'
        >
          Lingue
        </label>
        <Controller
          control={control}
          name='languages'
          render={({ field }) => (
            <LanguagesSelect
              languages={languages}
              value={field.value ?? []}
              onChange={field.onChange}
              hasError={!!errors.languages}
            />
          )}
        />
        {errors.languages && (
          <p className='text-xs text-destructive mt-2'>{errors.languages.message as string}</p>
        )}
      </div>

      <Separator className='my-4' />

      <div className='flex flex-col'>
        <label
          htmlFor='address'
          className='block text-sm font-semibold mb-2'
        >
          Indirizzo di residenza
        </label>
        <Controller
          control={control}
          name='address'
          render={({ field }) => (
            <AddressAutocompleteInput
              id='address'
              value={field.value ?? ''}
              onValueChange={field.onChange}
              onDetails={handleAddressDetails}
              placeholder="Inserisci l'indirizzo di residenza"
              error={errors.address?.message as string | undefined}
            />
          )}
        />
        {errors.address && (
          <p className='text-xs text-destructive mt-2'>{errors.address.message as string}</p>
        )}
        <input type='hidden' {...register('addressFormatted')} />
        <input type='hidden' {...register('streetName')} />
        <input type='hidden' {...register('streetNumber')} />
        <input type='hidden' {...register('placeId')} />
        <input type='hidden' {...register('latitude')} />
        <input type='hidden' {...register('longitude')} />
        <input type='hidden' {...register('countryName')} />
        <input type='hidden' {...register('countryCode')} />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label
            htmlFor='countryId'
            className='block text-sm font-semibold mb-2'
          >
            Stato
          </label>
          <Controller
            control={control}
            name='countryId'
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                onValueChange={(v) => field.onChange(parseInt(v))}
                disabled={isLoading}
              >
                <SelectTrigger
                  id='countryId'
                  className={cn(
                    'w-full',
                    errors.countryId && 'border-destructive text-destructive',
                  )}
                  size='sm'
                >
                  {countries.find((c) => c.id == field.value)?.name || 'seleziona stato'}
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
          {errors.countryId && (
            <p className='text-xs text-destructive mt-2'>{errors.countryId.message as string}</p>
          )}
        </div>

        <div className='flex flex-col'>
          <label
            htmlFor='subdivisionId'
            className='block text-sm font-semibold mb-2'
          >
            Provincia
          </label>
          <Controller
            control={control}
            name='subdivisionId'
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                disabled={!selectedCountryId || isLoading}
                onValueChange={(v) => field.onChange(parseInt(v))}
              >
                <SelectTrigger
                  id='subdivisionId'
                  className={cn(
                    'w-full',
                    errors.subdivisionId && 'border-destructive text-destructive',
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
          {errors.subdivisionId && (
            <p className='text-xs text-destructive mt-2'>
              {errors.subdivisionId.message as string}
            </p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label
            htmlFor='city'
            className='block text-sm font-semibold mb-2'
          >
            Comune
          </label>
          <Input
            id='city'
            {...register('city')}
            placeholder='Inserisci il comune'
            className={errors.city ? 'border-destructive text-destructive' : ''}
          />
          {errors.city && (
            <p className='text-xs text-destructive mt-2'>{errors.city.message as string}</p>
          )}
        </div>

        <div className='flex flex-col'>
          <label
            htmlFor='zipCode'
            className='block text-sm font-semibold mb-2'
          >
            CAP
          </label>
          <Input
            id='zipCode'
            {...register('zipCode', {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
            placeholder='Inserisci il CAP di residenza'
            className={errors.zipCode ? 'border-destructive text-destructive' : ''}
          />
          {errors.zipCode && (
            <p className='text-xs text-destructive mt-2'>{errors.zipCode.message as string}</p>
          )}
        </div>
      </div>

      <Separator className='my-4' />

      <div className='flex flex-col'>
        <div className='block text-sm font-semibold mb-2'>Sesso</div>
        <Controller
          control={control}
          name='gender'
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(v) => field.onChange(v as Gender)}
              className='flex flex-wrap gap-2'
            >
              {profileGenders.enumValues.map((gender) => (
                <label
                  key={gender}
                  htmlFor={`gender-${gender}`}
                  className={cn(
                    'h-10 flex items-center gap-2 text-sm p-2 rounded-xl capitalize border hover:cursor-pointer',
                    errors.gender && 'border-destructive text-destructive',
                  )}
                >
                  <RadioGroupItem
                    id={`gender-${gender}`}
                    value={gender}
                  />
                  {GENDERS_LABELS[gender]}
                </label>
              ))}
            </RadioGroup>
          )}
        />
        {errors.gender && (
          <p className='text-xs text-destructive mt-2'>{errors.gender.message as string}</p>
        )}
      </div>
    </>
  );
}
