'use client';

import { Button } from '@/components/ui/button';
import { ListFilter, X } from 'lucide-react';
import { ArtistSelectData, EventsCalendarFilters, VenueSelectData } from '@/lib/types';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { EVENTS_STATUS, EventStatus } from '@/lib/constants';
import VenueSelect from '@/app/(private)/_components/filters/mobile/VenueSelect';
import ArtistSelect from '@/app/(private)/_components/filters/mobile/ArtistSelect';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import EventStatusBadge from '@/app/(private)/_components/Badges/EventStatusBadge';

type FiltersButtonProps = {
  filters: EventsCalendarFilters;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
};

export function FiltersButton({ filters, artists, venues }: FiltersButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const active = Boolean(filters.artistIds && filters.venueIds && filters.status);

  const [artistIds, setArtistIds] = useState<string[]>(filters.artistIds || []);
  const [venueIds, setVenueIds] = useState<string[]>(filters.venueIds || []);
  const [status, setStatus] = useState<EventStatus[]>(filters.status || []);

  const resetHandler = () => {
    setArtistIds([]);
    setVenueIds([]);
    setStatus([]);
  };

  const toggleStatus = (value: EventStatus, next: boolean) => {
    setStatus((prev) => (next ? Array.from(new Set([...prev, value])) : prev.filter((v) => v !== value)));
  };

  const submitHandler = async () => {
    const params = new URLSearchParams();

    if (artistIds.length > 0) {
      params.set('artist', artistIds.join(','));
    } else {
      params.delete('artist');
    }

    if (venueIds.length > 0) {
      params.set('venue', venueIds.join(','));
    } else {
      params.delete('venue');
    }

    if (status.length > 0) {
      params.set('status', status.join(','));
    } else {
      params.delete('status');
    }

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
      setOpen(false);
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
          {EVENTS_STATUS.map((s) => {
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
            className='text-destructive'
            onClick={resetHandler}
          >
            <X />
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
