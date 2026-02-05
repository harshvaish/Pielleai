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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSWR from 'swr';
import {
  ArtistManagerSelectData,
  Country,
  Gender,
  Language,
  Subdivision,
  UserRole,
  VenueType,
  Zone,
} from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ArtistManagersSelect from '../create/ArtistManagersSelect';
import { Checkbox } from '@/components/ui/checkbox';
import { profileGenders } from '@/lib/database/schema';
import { GENDERS_LABELS } from '@/lib/constants';
import { Textarea } from '@/components/ui/textarea';

const CAPACITY_OPTIONS: VenueType[] = ['small', 'medium', 'big'];

const CAPACITY_LABELS: Record<VenueType, string> = {
  small: 'Piccola',
  medium: 'Media',
  big: 'Grande',
};

type StepOneProps = {
  userRole: UserRole;
  languages: Language[];
  countries: Country[];
  zones: Zone[];
  artistManagers: ArtistManagerSelectData[];
};

export default function StepOne({
  userRole,
  languages,
  countries,
  zones,
  artistManagers,
}: StepOneProps) {
  const {
    register,
    control,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);

  const isAdmin = userRole === 'admin';

  const selectedCountryId = watch('countryId');
  const selectedSubdivisionId = watch('subdivisionId');
  const selectedCountryCode =
    countries.find((country) => country.id === selectedCountryId)?.code?.toLowerCase() || 'it';

  const { data: response, isLoading } = useSWR(
    selectedCountryId ? `/api/country-subdivisions?c=${selectedCountryId}` : null,
    fetcher,
  );

  const subdivisionPlaceholder = useMemo(() => {
    if (isLoading) return 'Caricamento province...';
    if (!selectedCountryId) return 'seleziona stato';
    return 'seleziona provincia';
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
      <div className='grid grid-cols-[max-content_1fr_1fr] items-end gap-4'>
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
          htmlFor='stageName'
          className='block text-sm font-semibold mb-2'
        >
          Stage name
        </label>
        <Input
          id='stageName'
          {...register('stageName')}
          placeholder='Inserisci stage name'
          className={errors.stageName ? 'border-destructive text-destructive' : ''}
        />
        {errors.stageName && (
          <p className='text-xs text-destructive mt-2'>{errors.stageName.message as string}</p>
        )}
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='bio'
          className='block text-sm font-semibold mb-2'
        >
          Biografia
        </label>
        <Textarea
          id='bio'
          {...register('bio')}
          placeholder='Aggiungi la biografia'
          className={cn(
            'resize-none max-w-full h-full shadow-none',
            errors.bio && 'border-destructive text-destructive',
          )}
        />
        {errors.bio && (
          <p className='text-xs text-destructive mt-2'>{errors.bio.message as string}</p>
        )}
      </div>


      <div className='flex flex-col'>
        <label
          htmlFor='genres'
          className='block text-sm font-semibold mb-2'
        >
          Genere musicale
        </label>
        <Controller
          control={control}
          name='categories'
          render={({ field }) => {
            const GENRES = [
              'Alternative', 'Blues', 'Classica', 'Country', 'Dance', 'Elettronica', 'Folk', 'Funk', 'Gospel',
              'Hip Hop', 'Indie', 'Jazz', 'Metal', 'Pop', 'Punk', 'R&B', 'Rap', 'Reggae', 'Rock'
            ];
            return (
              <div className='flex flex-wrap gap-2'>
                {GENRES.map((genre) => (
                  <label key={genre} className='flex items-center gap-2 text-sm font-normal'>
                    <Checkbox
                      checked={field.value?.includes(genre) ?? false}
                      onCheckedChange={(checked) => {
                        if (checked) field.onChange([...(field.value ?? []), genre]);
                        else field.onChange((field.value ?? []).filter((g: string) => g !== genre));
                      }}
                    />
                    {genre}
                  </label>
                ))}
              </div>
            );
          }}
        />
        {errors.categories && (
          <p className='text-xs text-destructive mt-2'>
            {errors.categories.message as string}
          </p>
        )}
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='capacityCategory'
          className='block text-sm font-semibold mb-2'
        >
          Categoria capienza
        </label>
        <Controller
          control={control}
          name='capacityCategory'
          render={({ field }) => (
            <Select
              value={field.value ?? ''}
              onValueChange={(value) => field.onChange(value || undefined)}
            >
              <SelectTrigger
                id='capacityCategory'
                className={errors.capacityCategory ? 'border-destructive text-destructive' : ''}
              >
                <SelectValue placeholder='Seleziona capienza' />
              </SelectTrigger>
              <SelectContent>
                {CAPACITY_OPTIONS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {CAPACITY_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.capacityCategory && (
          <p className='text-xs text-destructive mt-2'>
            {errors.capacityCategory.message as string}
          </p>
        )}
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
          placeholder='Inserisci il numero di telefono, es. +39 0123456789'
          className={errors.phone ? 'border-destructive text-destructive' : ''}
          autoComplete='tel'
        />
        {errors.phone && (
          <p className='text-xs text-destructive mt-2'>{errors.phone.message as string}</p>
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
          placeholder="Inserisci l'email"
          className={errors.email ? 'border-destructive text-destructive' : ''}
          autoComplete='email'
        />
        {errors.email && (
          <p className='text-xs text-destructive mt-2'>{errors.email.message as string}</p>
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
              countryCode={selectedCountryCode}
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
                value={field.value}
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
                value={field.value}
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

      <Separator className='my-4' />

      <div className='flex flex-col'>
        <div className='block text-sm font-semibold mb-2'>Aree di interesse</div>
        <Controller
          control={control}
          name='zones'
          render={({ field }) => (
            <div className='flex flex-col'>
              <div className='flex flex-wrap gap-4'>
                {zones.map((zone) => (
                  <label
                    key={zone.id}
                    htmlFor={`zone-${zone.id}`}
                    className={cn(
                      'h-10 flex items-center gap-2 text-sm p-2 rounded-xl border cursor-pointer',
                      errors.zones && 'border-destructive text-destructive',
                    )}
                  >
                    <Checkbox
                      id={`zone-${zone.id}`}
                      checked={field.value.includes(zone.id)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, zone.id]
                          : field.value.filter((id: number) => id !== zone.id);
                        field.onChange(newValue);
                      }}
                    />
                    {zone.name}
                  </label>
                ))}
              </div>
              {errors.zones && (
                <p className='text-xs text-destructive mt-2'>{errors.zones.message as string}</p>
              )}
            </div>
          )}
        />
      </div>

      <Separator className='my-4' />

      {isAdmin && (
        <div className='flex flex-col'>
          <label
            htmlFor='artistManagers'
            className='block text-sm font-semibold mb-2'
          >
            Manager
          </label>
          <Controller
            control={control}
            name='artistManagers'
            render={({ field }) => (
              <ArtistManagersSelect
                artistManagers={artistManagers}
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.artistManagers}
              />
            )}
          />
          {errors.artistManagers && (
            <p className='text-xs text-destructive mt-2'>
              {errors.artistManagers.message as string}
            </p>
          )}
        </div>
      )}

      {isAdmin && <Separator className='my-4' />}

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label
            htmlFor='tourManagerName'
            className='block text-sm font-semibold mb-2'
          >
            Nome tour manager
          </label>
          <Input
            id='tourManagerName'
            {...register('tourManagerName')}
            placeholder='Inserisci il nome del tour manager'
            className={errors.tourManagerName ? 'border-destructive text-destructive' : ''}
            autoComplete='name'
          />
          {errors.tourManagerName && (
            <p className='text-xs text-destructive mt-2'>
              {errors.tourManagerName.message as string}
            </p>
          )}
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='tourManagerSurname'
            className='block text-sm font-semibold mb-2'
          >
            Cognome tour manager
          </label>
          <Input
            id='tourManagerSurname'
            {...register('tourManagerSurname')}
            placeholder='Inserisci il cognome del tour manager'
            className={errors.tourManagerSurname ? 'border-destructive text-destructive' : ''}
            autoComplete='family-name'
          />
          {errors.tourManagerSurname && (
            <p className='text-xs text-destructive mt-2'>
              {errors.tourManagerSurname.message as string}
            </p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label
            htmlFor='tourManagerPhone'
            className='block text-sm font-semibold mb-2'
          >
            Telefono tour manager
          </label>
          <Input
            id='tourManagerPhone'
            {...register('tourManagerPhone')}
            placeholder='Inserisci il numero di telefono del tour manager, es. +39 0123456789'
            className={errors.tourManagerPhone ? 'border-destructive text-destructive' : ''}
            autoComplete='tel'
          />
          {errors.tourManagerPhone && (
            <p className='text-xs text-destructive mt-2'>
              {errors.tourManagerPhone.message as string}
            </p>
          )}
        </div>

        <div className='flex flex-col'>
          <label
            htmlFor='tourManagerEmail'
            className='block text-sm font-semibold mb-2'
          >
            Email tour manager
          </label>
          <Input
            id='tourManagerEmail'
            {...register('tourManagerEmail')}
            placeholder="Inserisci l'email del tour manager"
            className={errors.tourManagerEmail ? 'border-destructive text-destructive' : ''}
            autoComplete='email'
          />
          {errors.tourManagerEmail && (
            <p className='text-xs text-destructive mt-2'>
              {errors.tourManagerEmail.message as string}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
