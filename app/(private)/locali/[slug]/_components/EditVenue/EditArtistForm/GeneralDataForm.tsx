'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn, fetcher } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { VENUE_TYPES, VenueType } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSWR from 'swr';
import { Country, Subdivision, VenueData, VenueManagerSelectData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import AvatarUploadInput from '@/app/(private)/_components/form/AvatarUploadInput';
import { EditVenueS1FormSchema, editVenueS1FormSchema } from '@/lib/validation/venueFormSchema';
import Image from 'next/image';
import { editVenueGeneralData } from '@/lib/server-actions/venues/edit-venue-general-data';

export default function GeneralDataForm({
  venueData,
  countries,
  venueManagers,
  closeDialog,
}: {
  venueData: VenueData;
  countries: Country[];
  venueManagers: VenueManagerSelectData[];
  closeDialog: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const defaultValues = useMemo(
    () => ({
      avatarUrl: venueData.avatarUrl || '',
      name: venueData.name || '',
      type: venueData.type || 'small',
      capacity: venueData.capacity || 0,
      address: venueData.address || '',
      countryId: venueData.country.id || 0,
      subdivisionId: venueData.subdivision.id || 0,
      city: venueData.city || '',
      zipCode: venueData.zipCode || '',
      venueManagerId: venueData.manager.profileId || 0,
    }),
    [venueData]
  );

  const methods = useForm({
    resolver: zodResolver(editVenueS1FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    register,
    control,
    formState: { isDirty, errors },
  } = methods;

  const selectedCountryId = methods.watch('countryId');
  const selectedSubdivisionId = methods.watch('subdivisionId');

  const { data, error, isLoading } = useSWR(selectedCountryId ? `/api/country-subdivisions?country=${selectedCountryId}` : null, fetcher);

  const subdivisions: Subdivision[] = useMemo(() => {
    return data?.subdivisions ?? [];
  }, [data?.subdivisions]);

  const subdivisionPlaceholder = useMemo(() => {
    if (isLoading) return 'Caricamento province...';
    if (!selectedCountryId) return 'seleziona stato';
    return 'seleziona provincia';
  }, [isLoading, selectedCountryId]);

  const onSubmit = async (data: EditVenueS1FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }
    setIsSubmitting(true);

    const response = await editVenueGeneralData({
      venueId: venueData.id,
      data: data,
    });

    if (response.success) {
      methods.reset(data); // new form status, isDirty to false
      toast.success('Scheda locale aggiornata!');
      closeDialog();
      router.refresh();
    } else {
      toast.error(response.message);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!selectedCountryId || isLoading || !subdivisions.length) return;

    const isValid = subdivisions.some((sub) => sub.id === selectedSubdivisionId);

    if (!isValid) {
      methods.resetField('subdivisionId', { defaultValue: 0 });
    }
  }, [selectedCountryId, selectedSubdivisionId, subdivisions, isLoading, methods]);

  useEffect(() => {
    if (error) {
      toast.error('Recupero delle province non riuscito.');
    }
  }, [error]);

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className='text-xl text-center font-bold'>Dati locale</div>
        <div className='grid grid-cols-[max-content_1fr] items-end gap-4'>
          <div className='flex flex-col'>
            <Controller
              control={control}
              name='avatarUrl'
              render={({ field }) => (
                <AvatarUploadInput
                  localStorageKey={'eva_temporary_url'} // create venue avatar
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
                  value={field.value.toString()}
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
                  value={field.value.toString()}
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
                value={field.value.toString()}
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

        <div className='flex justify-between mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
            variant='ghost'
            className='text-destructive'
            disabled={isSubmitting}
          >
            <X size={16} /> Annulla
          </Button>

          <Button
            type='submit'
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? 'Salvataggio...' : 'Salva'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
