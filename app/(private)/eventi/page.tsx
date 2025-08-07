import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronsUpDown, ListFilter } from 'lucide-react';
import { getArtists } from '@/lib/data/artists/get-artists';
import { getVenues } from '@/lib/data/venues/get-venues';
import { notFound } from 'next/navigation';
import CreateButton from './_components/create/CreateButton';
import { getMoCoordinators } from '@/lib/data/get-mo-coordinators';
import { getPaginatedEvents } from '@/lib/data/events/get-paginated-events';
import { TablePagination } from '../_components/TablePagination';
import EventTile from './_components/EventTile/EventTile';
import { EventStatus } from '@/lib/constants';
import StatusFilterButton from './_components/filters/StatusFilterButton';

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    status?: string;
  }>;
}) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');

  const filters = {
    currentPage: currentPage,
    filterStatus: (sp?.status ? sp.status.split(',') : []) as EventStatus[],
  };

  const [{ data: events, totalPages }, artists, venues, moCoordinators] = await Promise.all([getPaginatedEvents(filters), getArtists(), getVenues(), getMoCoordinators()]).catch((error) => {
    console.error('❌ Error fetching:', error);
    notFound();
  });

  return (
    <div className='h-full grid grid-rows-[min-content_min-content_1fr_min-content] gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl md:text-2xl font-bold'>Eventi</h1>
        <div className='flex items-center gap-4'>
          {/* <ToggleFiltersButton showFilters={showFilters} /> */}
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
          <div>
            Ordina{' '}
            <Button variant='ghost'>
              Pìù recente <ChevronDown />
            </Button>
          </div>
          <Button variant='outline'>
            Filtri <ListFilter />
          </Button>
          <Button variant='outline'>
            Data <ChevronsUpDown />
          </Button>
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
