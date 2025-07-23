'use client';

import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createVenue } from '@/lib/server-actions/venues/create-venue';
import {
  EventFormSchema,
  eventFormSchema,
} from '@/lib/validation/eventFormSchema';
import SearchArtistSelect from './SearchArtistSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { EVENTS_STATUS } from '@/lib/constants';
import EventStatusBadge from '../EventStatusBadge';
import ArtistManagerSelect from './ArtistManagerSelect';
import { useEffect, useState } from 'react';
import ArtistAvailabilitySelect from './ArtistAvailabilitySelect';
import { Separator } from '@/components/ui/separator';
import VenueSelect from './VenueSelect';
import { Input } from '@/components/ui/input';
import EventNotesInput from './EventNotesInput';

export default function CreateEventForm({
  artists,
  venues,
  closeDialog,
}: {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  closeDialog: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [vat, setVat] = useState<number>(0);
  const methods = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      artistId: undefined,
      status: 'proposed',
      artistManagerId: undefined,

      availabilityId: undefined,

      venueId: undefined,
      administration: '',

      cachetCost: 0,
      moCost: 0,
      djCost: 0,
      administrativeCost: 0,
      extrasCost: 0,
      consultingCost: 0,
      engagementCost: 0,
      socialsCost: 0,
      transportationCost: 0,
      artistCost: 0,
    },
  });
  const router = useRouter();

  const onSubmit = async (data: EventFormSchema) => {
    setIsLoading(true);
    const response = await createVenue(data);

    if (response.success) {
      toast.success('Evento creato!');
      router.refresh();
      closeDialog();
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const {
        cachetCost = 0,
        moCost = 0,
        djCost = 0,
        administrativeCost = 0,
        extrasCost = 0,
        consultingCost = 0,
        engagementCost = 0,
        socialsCost = 0,
        transportationCost = 0,
        artistCost = 0,
      } = values;

      const total =
        cachetCost +
        moCost +
        djCost +
        administrativeCost +
        extrasCost +
        consultingCost +
        engagementCost +
        socialsCost +
        transportationCost +
        artistCost;

      if (total > 0) {
        const newVat = parseFloat((total * 0.22).toFixed(2));

        // Only set if different (avoid infinite loop)
        if (totalCost !== total) {
          setTotalCost(total);
        }
        if (vat !== newVat) {
          setVat(newVat);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  return (
    <section className='max-h-full overflow-y-auto'>
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-4'
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className='text-2xl font-bold mb-4'>Crea evento</div>

          <div className='flex justify-between items-center gap-2'>
            <div className='flex flex-col'>
              <div className='block text-sm font-semibold mb-2'>Artista</div>
              <Controller
                control={methods.control}
                name='artistId'
                render={({ field }) => (
                  <SearchArtistSelect
                    artists={artists}
                    value={field.value}
                    setValue={field.onChange}
                  />
                )}
              />
              {methods.formState.errors.artistId && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.artistId.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='block text-sm font-semibold mb-2'>Stato</div>
              <Controller
                control={methods.control}
                name='status'
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={cn(
                        'min-w-40',
                        methods.formState.errors.status &&
                          'border-destructive text-destructive'
                      )}
                      size='sm'
                    >
                      <EventStatusBadge status={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENTS_STATUS.map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                        >
                          <EventStatusBadge status={status} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {methods.formState.errors.status && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.status.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Manager artista</div>
            <ArtistManagerSelect />
            {methods.formState.errors.artistManagerId && (
              <p className='text-xs text-destructive mt-2'>
                {methods.formState.errors.artistManagerId.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Disponibilità</div>
            <ArtistAvailabilitySelect />
            {methods.formState.errors.availabilityId && (
              <p className='text-xs text-destructive mt-2'>
                {methods.formState.errors.availabilityId.message as string}
              </p>
            )}
          </div>

          <Separator />

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Locale</div>
            <VenueSelect venues={venues} />
            {methods.formState.errors.venueId && (
              <p className='text-xs text-destructive mt-2'>
                {methods.formState.errors.venueId.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>
              Amministrazione / EMPAS
            </div>
            <Input
              id='name'
              {...methods.register('administration')}
              placeholder='Milano Ovest'
              className={
                methods.formState.errors.administration
                  ? 'border-destructive text-destructive'
                  : ''
              }
            />
            {methods.formState.errors.administration && (
              <p className='text-xs text-destructive mt-2'>
                {methods.formState.errors.administration.message as string}
              </p>
            )}
          </div>

          <Separator />

          <div className='grid grid-cols-[1fr_1fr] items-end gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Cachet</div>
              <Input
                {...methods.register('cachetCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.cachetCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.cachetCost && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.cachetCost.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>
                Commissione artista
              </div>
              <Input
                {...methods.register('artistCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.artistCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.artistCost && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.artistCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-[1fr_1fr] items-end gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>
                Commissione Milano Ovest
              </div>
              <Input
                {...methods.register('moCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.moCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.moCost && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.moCost.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Consulenza</div>
              <Input
                {...methods.register('consultingCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.consultingCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.consultingCost && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.consultingCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-[1fr_1fr] items-end gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>DJ</div>
              <Input
                {...methods.register('djCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.djCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.djCost && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.djCost.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Engagement</div>
              <Input
                {...methods.register('engagementCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.engagementCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.engagementCost && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.engagementCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-[1fr_1fr] items-end gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>
                Costi amministrativi
              </div>
              <Input
                {...methods.register('administrativeCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.administrativeCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.administrativeCost && (
                <p className='text-xs text-destructive mt-2'>
                  {
                    methods.formState.errors.administrativeCost
                      .message as string
                  }
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Socials</div>
              <Input
                {...methods.register('socialsCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.socialsCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.socialsCost && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.socialsCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-[1fr_1fr] items-end gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Altri costi</div>
              <Input
                {...methods.register('extrasCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.extrasCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.extrasCost && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.extrasCost.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Trasporto</div>
              <Input
                {...methods.register('transportationCost', {
                  valueAsNumber: true,
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={
                  methods.formState.errors.transportationCost
                    ? 'border-destructive text-destructive'
                    : ''
                }
              />
              {methods.formState.errors.transportationCost && (
                <p className='text-xs text-destructive mt-2'>
                  {
                    methods.formState.errors.transportationCost
                      .message as string
                  }
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className='flex flex-col'>
            <div className='flex justify-between items-center gap-2 mb-2'>
              <span className='text-lg font-semibold'>Costo totale</span>
              <span className='text-lg font-semibold'>€{totalCost}</span>
            </div>
            <div className='flex justify-between items-center gap-2 mb-2'>
              <span className='text-sm font-medium text-zinc-400'>
                Di cui IVA
              </span>
              <span className='text-sm font-medium text-zinc-400'>€{vat}</span>
            </div>
          </div>

          <Separator />

          <EventNotesInput />

          <Separator />

          <div className='flex justify-between'>
            <Button
              type='button'
              onClick={closeDialog}
              variant='ghost'
              className='text-destructive'
              disabled={isLoading}
            >
              <X /> Annulla
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? 'Creazione evento...' : 'Crea evento'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
