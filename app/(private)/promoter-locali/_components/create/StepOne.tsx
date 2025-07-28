import { useFormContext, Controller } from 'react-hook-form';
import AvatarUploadInput from '@/app/(private)/_components/AvatarUploadInput';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn, fetcher } from '@/lib/utils';
import LanguagesSelect from '@/app/(private)/_components/LanguagesSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Gender, GENDERS } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSWR from 'swr';
import { Country, Language, Subdivision } from '@/lib/types';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

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
    formState: { errors },
  } = useFormContext();

  const selectedCountryId = watch('countryId');
  const selectedSubdivisionId = watch('subdivisionId');

  const { data, error, isLoading } = useSWR(
    selectedCountryId
      ? `/api/country-subdivisions?country=${selectedCountryId}`
      : null,
    fetcher
  );

  const subdivisions: Subdivision[] = useMemo(() => {
    return data?.subdivisions ?? [];
  }, [data?.subdivisions]);

  const subdivisionPlaceholder = useMemo(() => {
    if (isLoading) return 'Caricamento province...';
    if (!selectedCountryId) return 'seleziona stato';
    return 'seleziona provincia';
  }, [isLoading, selectedCountryId]);

  useEffect(() => {
    if (!selectedCountryId || isLoading || !subdivisions.length) return;

    const isValid = subdivisions.some(
      (sub) => sub.id === selectedSubdivisionId
    );

    if (!isValid) {
      resetField('subdivisionId', { defaultValue: 0 });
    }
  }, [
    selectedCountryId,
    selectedSubdivisionId,
    subdivisions,
    isLoading,
    resetField,
  ]);

  useEffect(() => {
    if (error) {
      toast.error('Recupero delle province non riuscito.');
    }
  }, [error]);

  return (
    <>
      <div className='text-xl text-center font-bold'>Dati personali</div>
      <div className='grid grid-cols-[auto_1fr_1fr] items-end gap-4'>
        <div className='flex flex-col'>
          <Controller
            control={control}
            name='avatarUrl'
            render={({ field }) => (
              <AvatarUploadInput
                localStorageKey={'cvma_temporary_url'} // create venue manager avatar
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.avatarUrl}
              />
            )}
          />
          {errors.avatarUrl && (
            <p className='text-xs text-destructive mt-2'>
              {errors.avatarUrl.message as string}
            </p>
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
            placeholder='Mario'
            className={errors.name ? 'border-destructive text-destructive' : ''}
            autoComplete='name'
          />
          {errors.name && (
            <p className='text-xs text-destructive mt-2'>
              {errors.name.message as string}
            </p>
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
            placeholder='Rossi'
            className={
              errors.surname ? 'border-destructive text-destructive' : ''
            }
            autoComplete='family-name'
          />
          {errors.surname && (
            <p className='text-xs text-destructive mt-2'>
              {errors.surname.message as string}
            </p>
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
          placeholder='+39 123456789'
          className={errors.phone ? 'border-destructive text-destructive' : ''}
          autoComplete='tel'
        />
        {errors.phone && (
          <p className='text-xs text-destructive mt-2'>
            {errors.phone.message as string}
          </p>
        )}
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='email'
          className='block text-sm font-semibold mb-2'
        >
          Email
        </label>
        <Input
          id='email'
          {...register('email')}
          placeholder='info@eaglebooking.it'
          className={errors.email ? 'border-destructive text-destructive' : ''}
          autoComplete='email'
        />
        {errors.email && (
          <p className='text-xs text-destructive mt-2'>
            {errors.email.message as string}
          </p>
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
                  errors.birthDate && 'border-destructive text-destructive'
                )}
                type='date'
                {...field}
              />
            )}
          />
          {errors.birthDate && (
            <p className='text-xs text-destructive mt-2'>
              {errors.birthDate.message as string}
            </p>
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
            placeholder='Milano'
            className={
              errors.birthPlace ? 'border-destructive text-destructive' : ''
            }
          />
          {errors.birthPlace && (
            <p className='text-xs text-destructive mt-2'>
              {errors.birthPlace.message as string}
            </p>
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
              value={field.value}
              onChange={field.onChange}
              hasError={!!errors.languages}
            />
          )}
        />
        {errors.languages && (
          <p className='text-xs text-destructive mt-2'>
            {errors.languages.message as string}
          </p>
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
        <Input
          id='address'
          {...register('address')}
          placeholder='Via Duomo 1'
          className={
            errors.address ? 'border-destructive text-destructive' : ''
          }
          autoComplete='street-address'
        />
        {errors.address && (
          <p className='text-xs text-destructive mt-2'>
            {errors.address.message as string}
          </p>
        )}
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
                value={field.value}
                onValueChange={(v) => field.onChange(parseInt(v))}
                disabled={isLoading}
              >
                <SelectTrigger
                  id='countryId'
                  className={cn(
                    'w-full',
                    errors.countryId && 'border-destructive text-destructive'
                  )}
                  size='sm'
                >
                  {countries.find((c) => c.id == field.value)?.name ||
                    'seleziona stato'}
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
          {errors.countryId && (
            <p className='text-xs text-destructive mt-2'>
              {errors.countryId.message as string}
            </p>
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
                value={field.value}
                disabled={!selectedCountryId || isLoading}
                onValueChange={(v) => field.onChange(parseInt(v))}
              >
                <SelectTrigger
                  id='subdivisionId'
                  className={cn(
                    'w-full',
                    errors.subdivisionId &&
                      'border-destructive text-destructive'
                  )}
                  size='sm'
                >
                  {subdivisions.find((s) => s.id == field.value)?.name ||
                    subdivisionPlaceholder}
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
            placeholder='Milano'
            className={errors.city ? 'border-destructive text-destructive' : ''}
          />
          {errors.city && (
            <p className='text-xs text-destructive mt-2'>
              {errors.city.message as string}
            </p>
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
            placeholder='20100'
            className={
              errors.zipCode ? 'border-destructive text-destructive' : ''
            }
          />
          {errors.zipCode && (
            <p className='text-xs text-destructive mt-2'>
              {errors.zipCode.message as string}
            </p>
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
              {GENDERS.map((gender) => (
                <label
                  key={gender}
                  htmlFor={`gender-${gender}`}
                  className={cn(
                    'h-10 flex items-center gap-2 text-sm p-2 rounded-xl capitalize border hover:cursor-pointer',
                    errors.gender && 'border-destructive text-destructive'
                  )}
                >
                  <RadioGroupItem
                    id={`gender-${gender}`}
                    value={gender}
                  />
                  {gender}
                </label>
              ))}
            </RadioGroup>
          )}
        />
        {errors.gender && (
          <p className='text-xs text-destructive mt-2'>
            {errors.gender.message as string}
          </p>
        )}
      </div>
    </>
  );
}
