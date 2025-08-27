import CreateButton from './_components/create/CreateButton';
import { TablePagination } from '../_components/form/TablePagination';
import EventTile from './_components/EventTile/EventTile';
import StatusFilterButton from './_components/filters/StatusFilterButton';
import FiltersButton from './_components/filters/FiltersButton';
import { EventsTableFilters, EventStatus } from '@/lib/types';
import DatesFilterButton from './_components/filters/DatesFilterButton';
import { splitCsv } from '@/lib/utils';
import { getEventsCached } from '@/lib/cache/events';
import { getArtistsCached } from '@/lib/cache/artists';
import { getArtistManagersCached } from '@/lib/cache/artist-managers';
import { getVenuesCached } from '@/lib/cache/venues';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';

type EventsPageProps = {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    artist?: string;
    manager?: string;
    venue?: string;
    start?: string;
    end?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');

  const filters: EventsTableFilters = {
    currentPage: currentPage,
    status: splitCsv(sp?.status) as EventStatus[],
    artistIds: splitCsv(sp?.artist),
    artistManagerIds: splitCsv(sp?.manager),
    venueIds: splitCsv(sp?.venue),
    startDate: sp?.start ? new Date(sp.start) : null,
    endDate: sp?.end ? new Date(sp.end) : null,
  };

  const [{ data: events, totalPages }, artists, artistManagers, venues, moCoordinators] =
    await Promise.all([
      getEventsCached(filters),
      getArtistsCached(),
      getArtistManagersCached(),
      getVenuesCached(),
      getMoCoordinatorsCached(),
    ]);

  return (
    <div className='h-full grid grid-rows-[min-content_min-content_1fr_min-content] gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl md:text-2xl font-bold'>Eventi</h1>
        <div className='flex items-center gap-4'>
          <CreateButton
            artists={artists}
            venues={venues}
            moCoordinators={moCoordinators}
          />
        </div>
      </div>

      <div className='w-full flex flex-col lg:flex-row justify-between items-end lg:items-center gap-4 overflow-hidden'>
        <div className='max-w-full bg-white flex items-center gap-1 p-1 rounded-2xl overflow-auto'>
          <StatusFilterButton
            status='proposed'
            label='Proposto'
          />
          <StatusFilterButton
            status='pre-confirmed'
            label='Pre confermato'
          />
          <StatusFilterButton
            status='confirmed'
            label='Confermato'
          />
          <StatusFilterButton
            status='conflict'
            label='Conflitto'
          />
          <StatusFilterButton
            status='rejected'
            label='Rifiutato'
          />
        </div>
        <div className='flex items-center gap-1'>
          <FiltersButton
            filters={filters}
            artists={artists}
            artistManagers={artistManagers}
            venues={venues}
          />
          <DatesFilterButton filters={filters} />
        </div>
      </div>

      {/* events table section */}
      {events.length > 0 ? (
        <div className='max-h-full flex flex-col gap-4 bg-white p-4 overflow-auto rounded-2xl'>
          {events.map((event) => (
            <EventTile
              key={event.id}
              event={event}
              artists={artists}
              venues={venues}
              moCoordinators={moCoordinators}
            />
          ))}
        </div>
      ) : (
        <section className='flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun evento</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
        </section>
      )}
      {events.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
