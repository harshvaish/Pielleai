import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPaginatedVenueManagers } from '@/lib/data/venue-managers/get-paginated-venue-managers';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { notFound } from 'next/navigation';
import { TablePagination } from '../_components/TablePagination';
import UserBadge from '../_components/Badges/UserBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import { NEW_USER_TIME } from '@/lib/constants';
import ToggleFiltersButton from '../_components/ToggleFiltersButton';
import FilterInput from '../_components/FilterInput';
import CreateVenueManagerButton from './_components/CreateVenueManagerButton';
import VenuesBadge from '../_components/Badges/VenuesBadge';

export default async function VenueManagersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    artists?: string[];
    company?: string;
  }>;
}) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');
  const showFilters = sp?.showFilters === 'true';

  const filters = {
    currentPage: currentPage,
    fullName: sp?.fullName || '',
    email: sp?.email || '',
    phone: sp?.phone || '',
    artist: sp?.artists || [],
    company: sp?.company || '',
  };

  const [{ data: managers, totalPages }, languages, countries] =
    await Promise.all([
      getPaginatedVenueManagers(filters),
      getLanguages(),
      getCountries(),
    ]).catch((error) => {
      console.error('❌ Error fetching:', error);
      notFound();
    });

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Promoter locali</h1>
        <div className='flex items-center gap-4'>
          {managers.length > 0 && (
            <ToggleFiltersButton showFilters={showFilters} />
          )}
          <CreateVenueManagerButton
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
                {showFilters && (
                  <FilterInput
                    paramKey='fullName'
                    defaultValue={filters.fullName}
                  />
                )}
              </TableHead>
              <TableHead>
                <div>Email</div>
                {showFilters && (
                  <FilterInput
                    paramKey='email'
                    defaultValue={filters.email}
                  />
                )}
              </TableHead>
              <TableHead>
                <div>Numero di telefono</div>
                {showFilters && (
                  <FilterInput
                    paramKey='phone'
                    defaultValue={filters.phone}
                  />
                )}
              </TableHead>
              <TableHead>Locali</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {managers.map((manager, index) => {
              const isDisabled = manager.status === 'disabled';
              const isNew =
                new Date().getTime() - new Date(manager.createdAt).getTime() <
                NEW_USER_TIME;

              const badgeStatus = isDisabled
                ? 'disabled'
                : isNew
                  ? 'new'
                  : undefined;

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
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
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
