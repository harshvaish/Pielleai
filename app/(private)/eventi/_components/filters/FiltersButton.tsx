'use client';

import { Button } from '@/components/ui/button';
import { ListFilter, X } from 'lucide-react';
import { ArtistManagerSelectData, ArtistSelectData, EventsTableFilters, VenueSelectData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import ArtistSelect from '@/app/(private)/_components/filters/ArtistSelect';
import ArtistManagerSelect from '@/app/(private)/_components/filters/ArtistManagerSelect';
import VenueSelect from '@/app/(private)/_components/filters/VenueSelect';

type FiltersButtonProps = {
  filters: EventsTableFilters;
  artists: ArtistSelectData[];
  artistManagers: ArtistManagerSelectData[];
  venues: VenueSelectData[];
};

export default function FiltersButton({ filters, artists, artistManagers, venues }: FiltersButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [artistIds, setArtistIds] = useState<string[]>(filters.artistIds || []);
  const [artistManagerIds, setArtistManagerIds] = useState<string[]>(filters.artistManagerIds || []);
  const [venueIds, setVenueIds] = useState<string[]>(filters.venueIds || []);

  const active = Boolean(filters.artistIds.length && filters.artistManagerIds.length && filters.venueIds.length);

  const resetHandler = () => {
    setArtistIds([]);
    setArtistManagerIds([]);
    setVenueIds([]);
  };

  const submitHandler = async () => {
    const params = new URLSearchParams();

    if (artistIds.length > 0) {
      params.set('artist', artistIds.join(','));
    } else {
      params.delete('artist');
    }

    if (artistManagerIds.length > 0) {
      params.set('manager', artistManagerIds.join(','));
    } else {
      params.delete('manager');
    }

    if (venueIds.length > 0) {
      params.set('venue', venueIds.join(','));
    } else {
      params.delete('venue');
    }

    params.set('page', '1');

    startTransition(() => {
      router.push(`${window.location.pathname}?${params.toString()}`);
      setOpen(false);
    });
  };

  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      title='Filtri'
      description=''
      isDescriptionHidden={true}
      trigger={
        <Button
          variant={active ? 'secondary' : 'outline'}
          size='sm'
          disabled={isPending}
        >
          <ListFilter />
          Filtri
        </Button>
      }
    >
      <div className='flex flex-col gap-4 py-4'>
        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Artisti</div>
          <ArtistSelect
            initialValue={artistIds}
            artists={artists}
            onConfirm={setArtistIds}
          />
        </div>

        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Manager artisti</div>
          <ArtistManagerSelect
            initialValue={artistManagerIds}
            artistManagers={artistManagers}
            onConfirm={setArtistManagerIds}
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
    </ResponsivePopover>
  );
}
