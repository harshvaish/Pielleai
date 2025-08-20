import { useFormContext, Controller } from 'react-hook-form';
import AvatarUploadInput from '@/app/(private)/_components/form/AvatarUploadInput';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn, fetcher } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { VENUE_TYPES, VenueType } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSWR from 'swr';
import { Country, Subdivision, VenueManagerSelectData } from '@/lib/types';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

export default function StepOne({ countries, venueManagers }: { countries: Country[]; venueManagers: VenueManagerSelectData[] }) {
  const {
    register,
    control,
    watch,
    resetField,
    formState: { errors },
  } = useFormContext();

  const selectedCountryId = watch('countryId');
  const selectedSubdivisionId = watch('subdivisionId');

  const { data, error, isLoading } = useSWR(selectedCountryId ? `/api/country-subdivisions?country=${selectedCountryId}` : null, fetcher);

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

    const isValid = subdivisions.some((sub) => sub.id === selectedSubdivisionId);

    if (!isValid) {
      resetField('subdivisionId', { defaultValue: 0 });
    }
  }, [selectedCountryId, selectedSubdivisionId, subdivisions, isLoading, resetField]);

  useEffect(() => {
    if (error) {
      toast.error('Recupero delle province non riuscito.');
    }
  }, [error]);

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
                localStorageKey={'cva_temporary_url'} // create venue avatar
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.avatarUrl}
              />
            )}
          />
          {errors.avatarUrl && <p className='text-xs text-destructive mt-2'>{errors.avatarUrl.message as string}</p>}
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
            placeholder='La madunina'
            className={errors.name ? 'border-destructive text-destructive' : ''}
            autoComplete='name'
          />
          {errors.name && <p className='text-xs text-destructive mt-2'>{errors.name.message as string}</p>}
        </div>
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
              {VENUE_TYPES.map((type) => (
                <label
                  key={type}
                  htmlFor={`venue-type-${type}`}
                  className={cn('h-10 flex items-center gap-2 text-sm p-2 rounded-xl capitalize border hover:cursor-pointer', errors.type && 'border-destructive text-destructive')}
                >
                  <RadioGroupItem
                    id={`venue-type-${type}`}
                    value={type}
                  />
                  {type === 'small' && 'Club / DJ set'}
                  {type === 'medium' && 'Media > 3.000'}
                  {type === 'big' && 'Grande > 10.000'}
                </label>
              ))}
            </RadioGroup>
          )}
        />
        {errors.type && <p className='text-xs text-destructive mt-2'>{errors.type.message as string}</p>}
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
          placeholder='1000'
          type='number'
          min={0}
          step={1}
          className={errors.capacity ? 'border-destructive text-destructive' : ''}
        />
        {errors.capacity && <p className='text-xs text-destructive mt-2'>{errors.capacity.message as string}</p>}
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
          className={errors.address ? 'border-destructive text-destructive' : ''}
          autoComplete='street-address'
        />
        {errors.address && <p className='text-xs text-destructive mt-2'>{errors.address.message as string}</p>}
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
                  className={cn('w-full', errors.countryId && 'border-destructive text-destructive')}
                  size='sm'
                >
                  {countries.find((c) => c.id == field.value)?.name || 'seleziona stato'}
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
          {errors.countryId && <p className='text-xs text-destructive mt-2'>{errors.countryId.message as string}</p>}
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
                  className={cn('w-full', errors.subdivisionId && 'border-destructive text-destructive')}
                  size='sm'
                >
                  {subdivisions.find((s) => s.id == field.value)?.name || subdivisionPlaceholder}
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
          {errors.subdivisionId && <p className='text-xs text-destructive mt-2'>{errors.subdivisionId.message as string}</p>}
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
          {errors.city && <p className='text-xs text-destructive mt-2'>{errors.city.message as string}</p>}
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
            className={errors.zipCode ? 'border-destructive text-destructive' : ''}
          />
          {errors.zipCode && <p className='text-xs text-destructive mt-2'>{errors.zipCode.message as string}</p>}
        </div>
      </div>

      <Separator className='my-4' />

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
              value={field.value}
              onValueChange={(v) => field.onChange(parseInt(v))}
            >
              <SelectTrigger
                id='venueManagerId'
                className={cn('w-full', errors.venueManagerId && 'border-destructive text-destructive')}
                size='sm'
              >
                {(() => {
                  const selected = venueManagers.find((manager) => manager.profileId === field.value);
                  return selected ? `${selected.name} ${selected.surname}` : 'Seleziona un promoter';
                })()}
              </SelectTrigger>
              <SelectContent>
                {venueManagers.map((manager) => (
                  <SelectItem
                    key={manager.id}
                    value={manager.profileId.toString()}
                  >
                    <div className='flex items-center gap-2 flex-nowrap'>
                      <Image
                        src={manager.avatarUrl}
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
        {errors.venueManagerId && <p className='text-xs text-destructive mt-2'>{errors.venueManagerId.message as string}</p>}
      </div>

      <Separator className='my-4' />

      <div className='flex flex-col'>
        <div className='flex items-center space-x-2'>
          <Controller
            control={control}
            name='acceptTerms'
            render={({ field }) => (
              <Checkbox
                id='acceptTerms'
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
          <label
            htmlFor='acceptTerms'
            className={cn('text-xs font-normal', errors.acceptTerms && 'text-destructive')}
          >
            Accetto i <span className='underline underline-offset-2 hover:cursor-pointer'>Termini e le Condizioni</span> e l&apos;{' '}
            <span className='underline underline-offset-2 hover:cursor-pointer'>Informativa sulla Privacy</span> della piattaforma.
          </label>
        </div>
        {errors.acceptTerms && <p className='text-xs text-destructive mt-2'>{errors.acceptTerms.message as string}</p>}
      </div>
    </>
  );
}
