'use client';

import { useState, useTransition } from 'react';

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ArtistSelectData, EventsTableFilters, ArtistManagerSelectData, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ListFilter, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ArtistSelect from '@/app/(private)/_components/filters/mobile/ArtistSelect';
import ArtistManagerSelect from '@/app/(private)/_components/filters/mobile/ArtistManagerSelect';
import VenueSelect from '@/app/(private)/_components/filters/mobile/VenueSelect';

type FiltersDrawerProps = {
  filters: EventsTableFilters;
  artists: ArtistSelectData[];
  artistManagers: ArtistManagerSelectData[];
  venues: VenueSelectData[];
};

export default function FiltersDrawer({ filters, artists, artistManagers, venues }: FiltersDrawerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const active = filters.artistIds.length + filters.artistManagerIds.length + filters.venueIds.length > 0;

  const [artistIds, setArtistIds] = useState<string[]>(filters.artistIds || []);
  const [artistManagerIds, setArtistManagerIds] = useState<string[]>(filters.artistManagerIds || []);
  const [venueIds, setVenueIds] = useState<string[]>(filters.venueIds || []);

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
      router.replace(`${window.location.pathname}?${params.toString()}`);
      setIsOpen(false);
    });
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'outline'}
          size='sm'
        >
          <ListFilter />
          Filtri
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='flex flex-col gap-4 py-8 px-4'>
          <div className='flex justify-between items-center gap-2'>
            <DrawerTitle className='text-xl'>Filtri</DrawerTitle>
            <Button
              variant='ghost'
              size='sm'
              className='text-destructive'
              onClick={resetHandler}
            >
              Resetta
              <X />
            </Button>
          </div>

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

          <div className='grid grid-cols-2 gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={isPending}
              onClick={() => setIsOpen(false)}
            >
              Annulla
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
      </DrawerContent>
    </Drawer>
  );
}
