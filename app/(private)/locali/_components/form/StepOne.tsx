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
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSWR from 'swr';
import { Country, Subdivision, UserRole, VenueManagerSelectData, VenueType } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { venueTypes } from '@/lib/database/schema';
import { AVATAR_FALLBACK, VENUE_TYPE_LABELS } from '@/lib/constants';
import { VenueS1FormSchema } from '@/lib/validation/venue-form-schema';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type StepOneProps = {
  userRole: UserRole;
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
};

export default function StepOne({ userRole, countries, venueManagers }: StepOneProps) {
  const {
    register,
    control,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useFormContext<VenueS1FormSchema>();

  const isAdmin = userRole === 'admin';

  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);

  const selectedCountryId = watch('countryId');
  const selectedSubdivisionId = watch('subdivisionId');
  const venueManagerId = watch('venueManagerId');

  const selectedVenueManager = venueManagers.find(
    (manager) => manager.profileId === venueManagerId,
  );

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
      <div className='text-xl text-center font-bold'>Dati locale</div>
      <div className='grid grid-cols-[max-content_1fr] items-end gap-4'>
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
            placeholder='Inserisci il nome del locale'
            className={errors.name ? 'border-destructive text-destructive' : ''}
            autoComplete='name'
          />
          {errors.name && (
            <p className='text-xs text-destructive mt-2'>{errors.name.message as string}</p>
          )}
        </div>
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
          placeholder='Inserisci la biografia'
          className='resize-none max-w-full h-full shadow-none'
        />
        {errors.bio && (
          <p className='text-xs text-destructive mt-2'>{errors.bio.message as string}</p>
        )}
      </div>

      <Separator className='my-4' />

      <div className='flex flex-col'>
        <div className='block text-sm font-semibold mb-2'>Tipologia</div>
        <Controller
          control={control}
          name='type'
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(v) => field.onChange(v as VenueType)}
              className='flex flex-wrap gap-2'
            >
              {venueTypes.enumValues.map((type) => (
                <label
                  key={type}
                  htmlFor={`venue-type-${type}`}
                  className={cn(
                    'h-10 flex items-center gap-2 text-sm p-2 rounded-xl capitalize border hover:cursor-pointer',
                    errors.type && 'border-destructive text-destructive',
                  )}
                >
                  <RadioGroupItem
                    id={`venue-type-${type}`}
                    value={type}
                  />
                  {VENUE_TYPE_LABELS[type]}
                </label>
              ))}
            </RadioGroup>
          )}
        />
        {errors.type && (
          <p className='text-xs text-destructive mt-2'>{errors.type.message as string}</p>
        )}
      </div>

      <Separator className='my-4' />

      <div className='flex flex-col'>
        <label
          htmlFor='capacity'
          className='block text-sm font-semibold mb-2'
        >
          Capienza
        </label>
        <Input
          id='capacity'
          {...register('capacity', {
            valueAsNumber: true,
          })}
          placeholder='Inserisci la capienza'
          type='number'
          min={0}
          step={1}
          className={errors.capacity ? 'border-destructive text-destructive' : ''}
        />
        {errors.capacity && (
          <p className='text-xs text-destructive mt-2'>{errors.capacity.message as string}</p>
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
              placeholder="Inserisci l'indirizzo"
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
            placeholder='Inserisci il CAP'
            className={errors.zipCode ? 'border-destructive text-destructive' : ''}
          />
          {errors.zipCode && (
            <p className='text-xs text-destructive mt-2'>{errors.zipCode.message as string}</p>
          )}
        </div>
      </div>

      <Separator className='my-4' />

      {isAdmin && (
        <div className='flex flex-col'>
          <label
            htmlFor='venueManagerId'
            className='block text-sm font-semibold mb-2'
          >
            Promoter
          </label>
          <Controller
            control={control}
            name='venueManagerId'
            render={({ field }) => (
              <Select
                value={field.value?.toString() ?? ''}
                onValueChange={(v) => field.onChange(v ? parseInt(v) : undefined)}
              >
                <div className='flex items-center gap-2'>
                  <SelectTrigger
                    id='venueManagerId'
                    className={cn(
                      'w-full',
                      errors.venueManagerId && 'border-destructive text-destructive',
                    )}
                    size='sm'
                  >
                    {selectedVenueManager
                      ? `${selectedVenueManager.name} ${selectedVenueManager.surname}`
                      : 'Seleziona un promoter'}
                  </SelectTrigger>
                  {venueManagerId && (
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setValue('venueManagerId', undefined, { shouldDirty: true })}
                    >
                      <X className='size-4' />
                    </Button>
                  )}
                </div>
                <SelectContent>
                  {venueManagers.map((manager) => (
                    <SelectItem
                      key={manager.id}
                      value={manager.profileId?.toString()}
                    >
                      <div className='flex items-center gap-2 flex-nowrap'>
                        <Image
                          src={manager.avatarUrl || AVATAR_FALLBACK}
                          alt='Immagine profilo utente'
                          height={24}
                          width={24}
                          sizes='24px'
                          className='w-6 h-6 rounded-full'
                        />
                        {manager.name} {manager.surname}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.venueManagerId && (
            <p className='text-xs text-destructive mt-2'>
              {errors.venueManagerId.message as string}
            </p>
          )}
        </div>
      )}
    </>
  );
}
