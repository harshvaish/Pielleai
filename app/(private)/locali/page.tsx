import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCountries } from '@/lib/data/get-countries';
import { notFound } from 'next/navigation';
import { TablePagination } from '../_components/TablePagination';
import ToggleFiltersButton from '../_components/ToggleFiltersButton';
import UserBadge from '../_components/Badges/UserBadge';
import FilterInput from '../_components/FilterInput';
import { getVenueManagers } from '@/lib/data/venue-managers/get-venue-managers';
import CreateVenueButton from './_components/CreateVenueButton';
import { getPaginatedVenues } from '@/lib/data/venues/get-paginated-venues';
import ManagersBadge from '../_components/Badges/ManagersBadge';
import VenueTypeBadge from '../_components/Badges/VenueTypeBadge';

export default async function VenuesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    name?: string;
  }>;
}) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');
  const showFilters = sp?.showFilters === 'true';

  const filters = {
    currentPage: currentPage,
    name: sp?.name || '',
  };

  const [{ data: venues, totalPages }, countries, venueManagers] =
    await Promise.all([
      getPaginatedVenues(filters),
      getCountries(),
      getVenueManagers(),
    ]).catch((error) => {
      console.error('❌ Error fetching:', error);
      notFound();
    });

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Locali</h1>
        <div className='flex items-center gap-4'>
          {venues.length > 0 && (
            <ToggleFiltersButton showFilters={showFilters} />
          )}
          <CreateVenueButton
            countries={countries}
            venueManagers={venueManagers}
          />
        </div>
      </div>
      {/* venues table section */}
      {venues.length > 0 ? (
        <Table className='w-full'>
          <TableHeader className='bg-zinc-50'>
            <TableRow>
              <TableHead>
                <div>Nome</div>
                {showFilters && (
                  <FilterInput
                    paramKey='name'
                    defaultValue={filters.name}
                  />
                )}
              </TableHead>
              <TableHead>
                <div>Ragione sociale</div>
              </TableHead>
              <TableHead>
                <div>Partita IVA</div>
              </TableHead>
              <TableHead>Indirizzo</TableHead>
              <TableHead>Tipologia</TableHead>
              <TableHead>Promoter</TableHead>
              <TableHead>Capienza</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {venues.map((venue, index) => {
              const isDisabled = venue.status === 'disabled';

              return (
                <TableRow
                  key={index}
                  className={isDisabled ? 'text-zinc-400' : ''}
                >
                  <TableCell>
                    <div className='flex items-center flex-nowrap gap-3'>
                      <UserBadge
                        name={venue.name}
                        surname={''}
                        avatarUrl={venue.avatarUrl}
                        isDisabled={isDisabled}
                        href={`/locali/${venue.slug}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{venue.company}</TableCell>
                  <TableCell>{venue.taxCode}</TableCell>
                  <TableCell>{venue.address}</TableCell>
                  <TableCell>
                    <VenueTypeBadge type={venue.type} />
                  </TableCell>
                  <TableCell>
                    <ManagersBadge
                      managers={[venue.manager]}
                      pathSegment='promoter-locali'
                    />
                  </TableCell>
                  <TableCell>{venue.capacity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun locale</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
        </section>
      )}
      {venues.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
