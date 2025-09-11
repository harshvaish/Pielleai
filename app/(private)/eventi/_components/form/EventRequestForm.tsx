'use client';

import { ArtistSelectData, VenueSelectData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import VenueSelect from './VenueSelect';
import ArtistAvailabilitySelect from './ArtistAvailabilitySelect';
import ArtistManagerSelect from './ArtistManagerSelect';
import { Controller, useFormContext } from 'react-hook-form';
import ArtistSelect from './ArtistSelect';
import { EventFormSchema } from '@/lib/validation/event-form-schema';

type EventRequestForm = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
};

export default function EventRequestForm({ artists, venues }: EventRequestForm) {
  const {
    watch,
    register,
    control,
    formState: { errors },
  } = useFormContext<EventFormSchema>();

  const selectedVenueId = watch('venueId');
  const selectedVenue = venues.find((venue) => venue.id == selectedVenueId);

  return (
    <>
      <div className='flex flex-col'>
        <div className='text-sm font-semibold mb-2'>Artista</div>
        <Controller
          control={control}
          name='artistId'
          render={({ field }) => (
            <ArtistSelect
              artists={artists}
              value={field.value}
              setValue={field.onChange}
              hasError={!!errors.artistId}
            />
          )}
        />
        {errors.artistId && (
          <p className='text-xs text-destructive mt-2'>{errors.artistId.message as string}</p>
        )}
      </div>

      <div className='flex flex-col'>
        <div className='text-sm font-semibold mb-2'>Manager artista</div>
        <ArtistManagerSelect />
        {errors.artistManagerProfileId && (
          <p className='text-xs text-destructive mt-2'>
            {errors.artistManagerProfileId.message as string}
          </p>
        )}
      </div>

      <div className='flex flex-col'>
        <div className='text-sm font-semibold mb-2'>Data</div>
        <ArtistAvailabilitySelect />
        {errors.availability && (
          <p className='text-xs text-destructive mt-2'>Seleziona una disponibilità valida.</p>
        )}
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Location</div>
          <VenueSelect venues={venues} />
          {errors.venueId && (
            <p className='text-xs text-destructive mt-2'>{errors.venueId.message as string}</p>
          )}
        </div>

        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Indirizzo del locale</div>

          <div className='h-10 flex items-center text-sm'>
            {selectedVenue?.address ? (
              <span className='truncate'>{selectedVenue?.address}</span>
            ) : (
              <span className='text-zinc-400'>Seleziona un locale</span>
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='text-sm font-semibold mb-2'>Tour manager</div>
        <Input
          type='email'
          {...register('tourManagerEmail')}
          placeholder='tour.manager@eaglebooking.it'
          className={errors.tourManagerEmail ? 'border-destructive text-destructive' : ''}
        />
        {errors.tourManagerEmail && (
          <p className='text-xs text-destructive mt-2'>
            {errors.tourManagerEmail.message as string}
          </p>
        )}
      </div>

      <div className='flex flex-col'>
        <div className='text-sm font-semibold mb-2'>Assistenza</div>
        <Input
          type='email'
          {...register('administrationEmail')}
          placeholder='info@eaglebooking.it'
          className={errors.administrationEmail ? 'border-destructive text-destructive' : ''}
        />
        {errors.administrationEmail && (
          <p className='text-xs text-destructive mt-2'>
            {errors.administrationEmail.message as string}
          </p>
        )}
      </div>
    </>
  );
}
