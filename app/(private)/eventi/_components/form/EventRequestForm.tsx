'use client';

import { ArtistSelectData, UserRole, VenueSelectData } from '@/lib/types';
import VenueSelect from './VenueSelect';
import ArtistAvailabilitySelect from './ArtistAvailabilitySelect';
import { Controller, useFormContext } from 'react-hook-form';
import ArtistSelect from './ArtistSelect';
import { EventFormSchema } from '@/lib/validation/event-form-schema';
import QuickCreateArtistDialog from './QuickCreateArtistDialog';
import QuickCreateVenueDialog from './QuickCreateVenueDialog';
import { useEffect, useMemo, useState } from 'react';

type EventRequestForm = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  userRole: UserRole;
};

export default function EventRequestForm({ artists, venues, userRole }: EventRequestForm) {
  const {
    watch,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<EventFormSchema>();

  const canCreateArtist = userRole === 'admin' || userRole === 'artist-manager';
  const canCreateVenue = userRole === 'admin' || userRole === 'venue-manager';

  const [extraArtists, setExtraArtists] = useState<ArtistSelectData[]>([]);
  const [extraVenues, setExtraVenues] = useState<VenueSelectData[]>([]);

  const artistOptions = useMemo(() => {
    const merged = [...artists, ...extraArtists];
    const byId = new Map<number, ArtistSelectData>();
    for (const artist of merged) {
      byId.set(artist.id, artist);
    }
    return Array.from(byId.values());
  }, [artists, extraArtists]);

  const venueOptions = useMemo(() => {
    const merged = [...venues, ...extraVenues];
    const byId = new Map<number, VenueSelectData>();
    for (const venue of merged) {
      byId.set(venue.id, venue);
    }
    return Array.from(byId.values());
  }, [venues, extraVenues]);

  const selectedArtistId = watch('artistId');
  const selectedVenueId = watch('venueId');
  const selectedVenue = venueOptions.find((venue) => venue.id == selectedVenueId);

  useEffect(() => {
    if (!selectedArtistId || !selectedVenueId) {
      if (errors.venueId?.type === 'blacklist') {
        clearErrors('venueId');
      }
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    const checkBlacklist = async () => {
      try {
        const response = await fetch(
          `/api/artists/blacklist-check?a=${selectedArtistId}&v=${selectedVenueId}`,
          { signal: controller.signal },
        );
        const payload = await response.json();

        if (!isActive) return;

        if (!payload?.success) {
          if (errors.venueId?.type === 'blacklist') {
            clearErrors('venueId');
          }
          return;
        }

        if (payload.data?.blocked) {
          setError('venueId', {
            type: 'blacklist',
            message:
              'Questo artista non accetta prenotazioni da questo locale o area geografica.',
          });
        } else if (errors.venueId?.type === 'blacklist') {
          clearErrors('venueId');
        }
      } catch (error) {
        if (errors.venueId?.type === 'blacklist') {
          clearErrors('venueId');
        }
      }
    };

    checkBlacklist();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [selectedArtistId, selectedVenueId, setError, clearErrors]);

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex items-center justify-between gap-2 mb-2'>
          <div className='text-sm font-semibold'>Artista</div>
          {canCreateArtist && (
            <QuickCreateArtistDialog
              onCreated={(artist) => {
                setExtraArtists((prev) =>
                  prev.some((item) => item.id === artist.id) ? prev : [...prev, artist],
                );
                setValue('artistId', artist.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
                setValue('artistManagerProfileId', undefined);
                setValue('availability', { startDate: null as any, endDate: null as any });
              }}
            />
          )}
        </div>
        <Controller
          control={control}
          name='artistId'
          render={({ field }) => (
            <ArtistSelect
              artists={artistOptions}
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
        <div className='text-sm font-semibold mb-2'>Data</div>
        <ArtistAvailabilitySelect />
        {errors.availability && (
          <p className='text-xs text-destructive mt-2'>Seleziona una disponibilità valida.</p>
        )}
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <div className='flex items-center justify-between gap-2 mb-2'>
            <div className='text-sm font-semibold'>Location</div>
            {canCreateVenue && (
              <QuickCreateVenueDialog
                userRole={userRole}
                onCreated={(venue) => {
                  setExtraVenues((prev) =>
                    prev.some((item) => item.id === venue.id) ? prev : [...prev, venue],
                  );
                  setValue('venueId', venue.id, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              />
            )}
          </div>
          <VenueSelect venues={venueOptions} />
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
    </>
  );
}
