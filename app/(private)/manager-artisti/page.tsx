import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPaginatedArtistManagers } from '@/lib/data/artist-managers/get-paginated-artist-managers';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { notFound } from 'next/navigation';
import { TablePagination } from '../_components/TablePagination';
import UserBadge from '../_components/Badges/UserBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import { NEW_USER_TIME } from '@/lib/constants';
import FilterInput from '../_components/FilterInput';
import ArtistsBadge from '../_components/Badges/ArtistsBadge';
import { getArtists } from '@/lib/data/artists/get-artists';
import ArtistFilter from './_components/filters/desktop/ArtistFilter';
import FiltersButton from './_components/filters/FiltersButton';
import { ArtistManagersTableFilters } from '@/lib/types';
import CreateButton from './_components/create/CreateButton';

export default async function ArtistManagersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    artist?: string;
    company?: string;
  }>;
}) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');
  const showFilters = sp?.showFilters === 'true';

  const filters: ArtistManagersTableFilters = {
    currentPage: currentPage,
    fullName: sp?.fullName || '',
    email: sp?.email || '',
    phone: sp?.phone || '',
    artistIds: sp?.artist ? sp.artist.split(',') : [],
    company: sp?.company || '',
  };

  const [{ data: managers, totalPages }, languages, countries, artists] =
    await Promise.all([
      getPaginatedArtistManagers(filters),
      getLanguages(),
      getCountries(),
      getArtists(),
    ]).catch((error) => {
      console.error('❌ Error fetching:', error);
      notFound();
    });

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Manager Artisti</h1>
        <div className='flex items-center gap-2 md:gap-4 mt-2 md:mt-0'>
          {(managers.length > 0 || showFilters) && (
            <FiltersButton
              filters={filters}
              showFilters={showFilters}
              artists={artists}
            />
          )}
          <CreateButton
            languages={languages}
            countries={countries}
          />
        </div>
      </div>
      {/* artist managers table section */}
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
                <div>Artisti</div>
                <div className='hidden md:block'>
                  {showFilters && <ArtistFilter artists={artists} />}
                </div>
              </TableHead>
              <TableHead>
                <div>Ragione sociale</div>
                <div className='hidden md:block'>
                  {showFilters && (
                    <FilterInput
                      paramKey='company'
                      defaultValue={filters.company}
                    />
                  )}
                </div>
              </TableHead>
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
                        href={`/manager-artisti/${manager.id}`}
                      />
                      {badgeStatus && <StatusBadge status={badgeStatus} />}
                    </div>
                  </TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.phone}</TableCell>
                  <TableCell>
                    <ArtistsBadge artists={manager.artists} />
                  </TableCell>
                  <TableCell>{manager.company}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun manager artista</h2>
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
