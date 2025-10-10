'use client';

import { Button } from '@/components/ui/button';
import { Eraser, ListFilter } from 'lucide-react';
import {
  ArtistSelectData,
  EventsCalendarFilters,
  EventStatus,
  UserRole,
  VenueSelectData,
} from '@/lib/types';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import VenueSelect from '@/app/(private)/_components/filters/VenueSelect';
import ArtistSelect from '@/app/(private)/_components/filters/ArtistSelect';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { eventStatus } from '@/lib/database/schema';
import EventStatusBadge from '../Badges/EventStatusBadge';

type FiltersButtonProps = {
  userRole: UserRole;
  filters: EventsCalendarFilters;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
};

export function FiltersButton({ userRole, filters, artists, venues }: FiltersButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [artistIds, setArtistIds] = useState<string[]>(filters.artistIds || []);
  const [venueIds, setVenueIds] = useState<string[]>(filters.venueIds || []);
  const [status, setStatus] = useState<EventStatus[]>(filters.status || []);

  const active = Boolean(
    filters.artistIds.length || filters.venueIds.length || filters.status.length,
  );

  const isAdmin = userRole === 'admin';

  const resetHandler = () => {
    setArtistIds([]);
    setVenueIds([]);
    setStatus([]);
  };

  const toggleStatus = (value: EventStatus, next: boolean) => {
    setStatus((prev) =>
      next ? Array.from(new Set([...prev, value])) : prev.filter((v) => v !== value),
    );
  };

  const submitHandler = async () => {
    const params = new URLSearchParams();

    if (artistIds.length > 0) {
      params.set('a', artistIds.join(','));
    } else {
      params.delete('a');
    }

    if (venueIds.length > 0) {
      params.set('v', venueIds.join(','));
    } else {
      params.delete('v');
    }

    if (status.length > 0) {
      params.set('s', status.join(','));
    } else {
      params.delete('s');
    }

    setOpen(false);

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  return (
    <ResponsivePopover
      trigger={
        <Button
          size='sm'
          variant={active ? 'secondary' : 'outline'}
          disabled={isPending}
        >
          <ListFilter className='size-4' />
          Filtri
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
      title='Filtri'
      description='Applica i filtri per visualizzare gli eventi di tuo interesse.'
    >
      <div className='space-y-4'>
        <div className='grid sm:grid-cols-2 gap-2'>
          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Artisti</div>
            <ArtistSelect
              initialValue={artistIds}
              artists={artists}
              onConfirm={setArtistIds}
            />
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Locali</div>
            <VenueSelect
              initialValue={venueIds}
              venues={venues}
              onConfirm={setVenueIds}
            />
          </div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-semibold'>Stato</div>
          {eventStatus.enumValues.map((s) => {
            if (!isAdmin && s === 'conflict') return null;

            const checked = status.includes(s);

            return (
              <label
                key={s}
                htmlFor={s}
                className={cn('max-w-max flex items-center gap-2 text-sm cursor-pointer')}
              >
                <Checkbox
                  id={s}
                  checked={checked}
                  onCheckedChange={(v) => toggleStatus(s, Boolean(v))}
                />
                <EventStatusBadge
                  status={s}
                  size='sm'
                />
              </label>
            );
          })}
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={resetHandler}
          >
            <Eraser />
            Pulisci
          </Button>
          <Button
            size='sm'
            disabled={isPending}
            onClick={submitHandler}
          >
            {isPending ? 'Filtro...' : 'Conferma'}
          </Button>
        </div>
      </div>
    </ResponsivePopover>
  );
}
