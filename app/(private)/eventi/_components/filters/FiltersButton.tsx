'use client';

import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { ListFilter } from 'lucide-react';
import { ArtistManagerSelectData, ArtistSelectData, EventsTableFilters, VenueSelectData } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ArtistFilter from '@/app/(private)/_components/filters/desktop/ArtistFilter';
import FiltersDrawer from './mobile/FiltersDrawer';
import VenueFilter from '@/app/(private)/_components/filters/desktop/VenueFilter';
import ArtistManagerFilter from '@/app/(private)/_components/filters/desktop/ArtistManagerFilter';
import { Separator } from '@/components/ui/separator';

type FiltersButtonProps = {
  filters: EventsTableFilters;
  artists: ArtistSelectData[];
  artistManagers: ArtistManagerSelectData[];
  venues: VenueSelectData[];
};

export default function FiltersButton({ filters, artists, artistManagers, venues }: FiltersButtonProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const active = filters.artistIds.length + filters.artistManagerIds.length + filters.venueIds.length > 0;

  return isDesktop ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'outline'}
          size='sm'
        >
          <ListFilter />
          Filtri
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='space-y-4'
      >
        <div className='text-lg font-semibold'>Filtri</div>

        <Separator />

        <div>
          <div className='text-sm font-semibold'>Artisti</div>
          <ArtistFilter artists={artists} />
        </div>

        <div>
          <div className='text-sm font-semibold'>Manager artisti</div>
          <ArtistManagerFilter artistManagers={artistManagers} />
        </div>

        <div>
          <div className='text-sm font-semibold'>Locali</div>
          <VenueFilter venues={venues} />
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <FiltersDrawer
      filters={filters}
      artists={artists}
      artistManagers={artistManagers}
      venues={venues}
    />
  );
}
