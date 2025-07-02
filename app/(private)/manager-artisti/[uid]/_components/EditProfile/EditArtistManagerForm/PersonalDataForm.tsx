'use client';

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
import { Gender, GENDERS } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSWR from 'swr';
import {
  ArtistsManagerData,
  Country,
  Language,
  Subdivision,
} from '@/lib/types';
import { toast } from 'sonner';
import LanguagesSelect from '@/app/(private)/manager-artisti/_components/LanguagesSelect';
import {
  ArtistManagerS1FormSchema,
  artistManagerFormS1Schema,
} from '@/lib/validation/artistManagerFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { editArtistManagerPersonalData } from '@/lib/server-actions/artist-manager/edit-artist-manager-personal-data';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import AvatarUploadInput from '@/app/(private)/manager-artisti/_components/AvatarUploadInput';

export default function PersonalDataForm({
  userData,
  languages,
  countries,
  onCancel,
}: {
  userData: ArtistsManagerData;
  languages: Language[];
  countries: Country[];
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const methods = useForm({
    resolver: zodResolver(artistManagerFormS1Schema),
    defaultValues: {
      avatarUrl: userData.avatarUrl,
      name: userData.name || '',
      surname: userData.surname || '',
      phone: userData.phone || '',
      email: userData.email || '',
      birthDate: userData.birthDate || '',
      birthPlace: userData.birthPlace || '',
      languages: userData.languages || [],
      address: userData.address || '',
      countryId: userData.countryId || 0,
      subdivisionId: userData.subdivisionId || 0,
      city: userData.city || '',
      zipCode: userData.zipCode || '',
      gender: userData.gender || 'maschile',
    },
  });
  const router = useRouter();

  const {
    register,
    control,
    formState: { isDirty, errors },
  } = methods;

  const selectedCountryId = methods.watch('countryId');

  // Reset subdivision when selectedCountryId changes
  useEffect(() => {
    if (!selectedCountryId) return;
    methods.resetField('subdivisionId');
  }, [selectedCountryId, methods]);

  const { data } = useSWR(
    selectedCountryId
      ? `/api/country-subdivisions?country=${selectedCountryId}`
      : null,
    fetcher
  );
  const subdivisions: Subdivision[] = data?.subdivisions ?? [];

  if (subdivisions.length === 0) {
    toast.error('Recupero delle province non riuscito.');
  }

  const onSubmit = async (data: ArtistManagerS1FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }
    setIsLoading(true);

    const response = await editArtistManagerPersonalData({
      profileId: userData.profileId,
      data: data,
    });

    if (response.success) {
      methods.reset(data); // new form status, isDirty to false
      toast.success('Profilo manager artisti aggiornato!');
      router.refresh();
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className='grid grid-cols-[auto_1fr_1fr] items-end gap-4'>
          <div className='flex flex-col'>
            <Controller
              control={control}
              name='avatarUrl'
              render={({ field }) => (
                <AvatarUploadInput
                  localStorageKey={'eama_temporary_url'} // edit artist manager avatar
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
              className={
                errors.name ? 'border-destructive text-destructive' : ''
              }
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
            className={
              errors.phone ? 'border-destructive text-destructive' : ''
            }
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
            className={
              errors.email ? 'border-destructive text-destructive' : ''
            }
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
                  value={field.value.toString()}
                  onValueChange={(v) => field.onChange(parseInt(v))}
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
                  value={field.value.toString()}
                  disabled={!selectedCountryId}
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
              className={
                errors.city ? 'border-destructive text-destructive' : ''
              }
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
                className='flex gap-2'
              >
                {GENDERS.map((gender) => (
                  <label
                    key={gender}
                    className={cn(
                      'h-10 flex items-center gap-2 text-sm p-2 rounded-xl capitalize border hover:cursor-pointer',
                      errors.gender && 'border-destructive text-destructive'
                    )}
                  >
                    <RadioGroupItem
                      value={gender}
                      id={gender}
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
        <div className='flex justify-between mt-4'>
          <Button
            type='button'
            onClick={onCancel}
            variant='ghost'
            className='text-destructive'
            disabled={isLoading}
          >
            <X size={16} /> Annulla
          </Button>

          <Button
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Salvataggio...' : 'Salva'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
