import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCountries } from '@/lib/data/get-countries';
import { TablePagination } from '../_components/form/TablePagination';
import UserBadge from '../_components/badges/UserBadge';
import { getVenueManagers } from '@/lib/data/venue-managers/get-venue-managers';
import { getPaginatedVenues } from '@/lib/data/venues/get-paginated-venues';
import ManagersBadge from '../_components/badges/ManagersBadge';
import VenueTypeBadge from '../_components/badges/VenueTypeBadge';
import { VenueType } from '@/lib/constants';
import { VenuesTableFilters } from '@/lib/types';
import FiltersButton from './_components/filters/FiltersButton';
import CreateButton from './_components/create/CreateButton';

type VenuesPageProps = {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    name?: string;
    company?: string;
    taxCode?: string;
    address?: string;
    type?: string;
    manager?: string;
    capacity?: string;
  }>;
};

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');

  const filters: VenuesTableFilters = {
    currentPage: currentPage,
    name: sp?.name || '',
    company: sp?.company || '',
    taxCode: sp?.taxCode || '',
    address: sp?.address || '',
    types: (sp?.type ? sp.type.split(',') : []) as VenueType[],
    managerIds: sp?.manager ? sp.manager.split(',') : [],
    capacity: sp?.capacity || '',
  };

  const [{ data: venues, totalPages }, countries, venueManagers] = await Promise.all([getPaginatedVenues(filters), getCountries(), getVenueManagers()]);

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Locali</h1>
        <div className='flex items-center gap-2 md:gap-4 mt-2 md:mt-0'>
          <FiltersButton
            filters={filters}
            venueManagers={venueManagers}
          />

          <CreateButton
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
              <TableHead>Nome</TableHead>
              <TableHead>Ragione sociale</TableHead>
              <TableHead>Partita IVA</TableHead>
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
          <div className='text-sm font-medium text-zinc-400'>Aggiungine uno per vederlo nella lista</div>
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
