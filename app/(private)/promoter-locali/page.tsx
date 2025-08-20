import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPaginatedVenueManagers } from '@/lib/data/venue-managers/get-paginated-venue-managers';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { notFound } from 'next/navigation';
import { TablePagination } from '../_components/form/TablePagination';
import UserBadge from '../_components/Badges/UserBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import { NEW_USER_TIME } from '@/lib/constants';
import FilterInput from '../_components/filters/desktop/FilterInput';
import CreateButton from './_components/create/CreateButton';
import VenuesBadge from '../_components/Badges/VenuesBadge';
import VenueFilter from '../_components/filters/desktop/VenueFilter';
import { getVenues } from '@/lib/data/venues/get-venues';
import FiltersButton from './_components/filters/FiltersButton';
import { VenueManagersTableFilters } from '@/lib/types';

export default async function VenueManagersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    venue?: string;
  }>;
}) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');
  const showFilters = sp?.showFilters === 'true';

  const filters: VenueManagersTableFilters = {
    currentPage: currentPage,
    fullName: sp?.fullName || '',
    email: sp?.email || '',
    phone: sp?.phone || '',
    venueIds: sp?.venue ? sp.venue.split(',') : [],
  };

  const [{ data: managers, totalPages }, languages, countries, venues] = await Promise.all([getPaginatedVenueManagers(filters), getLanguages(), getCountries(), getVenues()]).catch((error) => {
    console.error('❌ Error fetching:', error);
    notFound();
  });

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Promoter locali</h1>
        <div className='flex items-center gap-2 md:gap-4 mt-2 md:mt-0'>
          {(managers.length > 0 || showFilters) && (
            <FiltersButton
              filters={filters}
              showFilters={showFilters}
              venues={venues}
            />
          )}
          <CreateButton
            languages={languages}
            countries={countries}
          />
        </div>
      </div>
      {/* venue managers table section */}
      {managers.length > 0 ? (
        <Table className='w-full'>
          <TableHeader className='bg-zinc-50'>
            <TableRow>
              <TableHead>
                <div>Nome completo</div>
                <div className='hidden md:block'>
                  {showFilters && (
                    <FilterInput
                      paramKey='fullName'
                      defaultValue={filters.fullName}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div>Email</div>
                <div className='hidden md:block'>
                  {showFilters && (
                    <FilterInput
                      paramKey='email'
                      defaultValue={filters.email}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div>Numero di telefono</div>
                <div className='hidden md:block'>
                  {showFilters && (
                    <FilterInput
                      paramKey='phone'
                      defaultValue={filters.phone}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div>Locali</div>
                <div className='hidden md:block'>{showFilters && <VenueFilter venues={venues} />}</div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {managers.map((manager, index) => {
              const isDisabled = manager.status === 'disabled';
              const isNew = new Date().getTime() - new Date(manager.createdAt).getTime() < NEW_USER_TIME;

              const badgeStatus = isDisabled ? 'disabled' : isNew ? 'new' : undefined;

              return (
                <TableRow
                  key={index}
                  className={isDisabled ? 'text-zinc-400' : ''}
                >
                  <TableCell>
                    <div className='flex items-center flex-nowrap gap-3'>
                      <UserBadge
                        name={manager.name}
                        surname={manager.surname}
                        avatarUrl={manager.avatarUrl}
                        isDisabled={isDisabled}
                        href={`/promoter-locali/${manager.id}`}
                      />
                      {badgeStatus && <StatusBadge status={badgeStatus} />}
                    </div>
                  </TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.phone}</TableCell>
                  <TableCell>
                    <VenuesBadge venues={manager.venues} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun promoter locali</h2>
          <div className='text-sm font-medium text-zinc-400'>Aggiungine uno per vederlo nella lista</div>
        </section>
      )}
      {managers.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
