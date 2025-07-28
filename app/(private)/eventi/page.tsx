import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronsUpDown, ListFilter } from 'lucide-react';
import { getArtists } from '@/lib/data/artists/get-artists';
import { getVenues } from '@/lib/data/venues/get-venues';
import { notFound } from 'next/navigation';
import CreateButton from './_components/CreateButton';

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');

  const filters = {
    currentPage: currentPage,
  };

  // const [{ data: events, totalPages }, artists, venues] = await Promise.all([
  const [artists, venues] = await Promise.all([
    // getPaginatedEvents(filters),
    getArtists(),
    getVenues(),
  ]).catch((error) => {
    console.error('❌ Error fetching:', error);
    notFound();
  });

  return (
    <div className='h-full grid grid-rows-[min-content_min-content_1fr_min-content] gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl md:text-2xl font-bold'>Eventi</h1>
        <div className='flex items-center gap-4'>
          {/* <ToggleFiltersButton showFilters={showFilters} /> */}
          <div>export</div>
          <div>crea</div>
          <CreateButton
            artists={artists}
            venues={venues}
          />
        </div>
      </div>

      <div className='flex justify-between items-center'>
        <div className='bg-white flex items-center gap-1 p-1 rounded-2xl'>
          <Button
            variant='ghost'
            size='sm'
          >
            Tutti
          </Button>
          <Button
            variant='ghost'
            size='sm'
          >
            Proposto
          </Button>
          <Button
            variant='ghost'
            size='sm'
          >
            Preconfermato
          </Button>
          <Button
            variant='ghost'
            size='sm'
          >
            Confermato
          </Button>
          <Button
            variant='ghost'
            size='sm'
          >
            Rifiutato
          </Button>
          <Button
            variant='ghost'
            size='sm'
          >
            Finito
          </Button>
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
      <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
        <h2 className='text-base font-bold'>Nessun evento</h2>
        <div className='text-sm font-medium text-zinc-400'>
          Aggiungine uno per vederlo nella lista
        </div>
      </section>
    </div>
  );
}
