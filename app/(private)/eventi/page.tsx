import { getArtists } from '@/lib/data/artists/get-artists';
import { getVenues } from '@/lib/data/venues/get-venues';
import { notFound } from 'next/navigation';
import CreateButton from './_components/create/CreateButton';
import { getMoCoordinators } from '@/lib/data/get-mo-coordinators';
import { getPaginatedEvents } from '@/lib/data/events/get-paginated-events';
import { TablePagination } from '../_components/TablePagination';
import EventTile from './_components/EventTile/EventTile';
import { EventStatus, TIME_ZONE } from '@/lib/constants';
import StatusFilterButton from './_components/filters/StatusFilterButton';
import FiltersButton from './_components/filters/FiltersButton';
import { EventsTableFilters } from '@/lib/types';
import { getArtistManagers } from '@/lib/data/artist-managers/get-artist-managers';
import { parse } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import DatesFilterButton from './_components/filters/DatesFilterButton';

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    artist?: string;
    manager?: string;
    venue?: string;
    start?: string;
    end?: string;
  }>;
}) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');
  const { startUtc, endUtc } = toUTCRange(sp?.start, sp?.end);

  const filters: EventsTableFilters = {
    currentPage: currentPage,
    status: (sp?.status ? sp.status.split(',') : []) as EventStatus[],
    artistIds: sp?.artist ? sp.artist.split(',') : [],
    artistManagerIds: sp?.manager ? sp.manager.split(',') : [],
    venueIds: sp?.venue ? sp.venue.split(',') : [],
    startDate: startUtc,
    endDate: endUtc,
  };

  const [{ data: events, totalPages }, artists, artistManagers, venues, moCoordinators] = await Promise.all([
    getPaginatedEvents(filters),
    getArtists(),
    getArtistManagers(),
    getVenues(),
    getMoCoordinators(),
  ]).catch((error) => {
    console.error('❌ Error fetching:', error);
    notFound();
  });

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

      <div className='flex justify-between items-center'>
        <div className='bg-white flex items-center gap-1 p-1 rounded-2xl'>
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
        <div className='max-h-full flex flex-col gap-4 overflow-auto'>
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
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun evento</h2>
          <div className='text-sm font-medium text-zinc-400'>Aggiungine uno per vederlo nella lista</div>
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

export function toUTCRange(start?: string, end?: string) {
  let startUtc: Date | null = null;
  let endUtc: Date | null = null;

  if (!start || !end || start > end) {
    return { startUtc, endUtc };
  }

  const dStart = parse(`${start} 00:00`, 'yyyy-MM-dd HH:mm', new Date());
  startUtc = fromZonedTime(dStart, TIME_ZONE);

  const dEnd = parse(`${end} 23:59:59.999`, 'yyyy-MM-dd HH:mm:ss.SSS', new Date());
  endUtc = fromZonedTime(dEnd, TIME_ZONE);

  return { startUtc, endUtc };
}
