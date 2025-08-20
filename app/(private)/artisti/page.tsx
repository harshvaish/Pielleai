import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { notFound } from 'next/navigation';
import { NEW_USER_TIME } from '@/lib/constants';
import { TablePagination } from '../_components/form/TablePagination';
import UserBadge from '../_components/Badges/UserBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import FilterInput from '../_components/filters/desktop/FilterInput';
import { getPaginatedArtists } from '@/lib/data/artists/get-paginated-artists';
import { getZones } from '@/lib/data/artists/get-zones';
import { getArtistManagers } from '@/lib/data/artist-managers/get-artist-managers';
import ZonesBadge from '../_components/Badges/ZonesBadge';
import ManagersBadge from '../_components/Badges/ManagersBadge';
import ArtistManagerFilter from '../_components/filters/desktop/ArtistManagerFilter';
import { ArtistsTableFilters } from '@/lib/types';
import FiltersButton from './_components/filters/FiltersButton';
import ZoneFilter from '../_components/filters/desktop/ZoneFilter';
import CreateButton from './_components/create/CreateButton';

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    manager?: string;
    zone?: string;
  }>;
}) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');
  const showFilters = sp?.showFilters === 'true';

  const filters: ArtistsTableFilters = {
    currentPage: currentPage,
    fullName: sp?.fullName || '',
    email: sp?.email || '',
    phone: sp?.phone || '',
    managerIds: sp?.manager ? sp.manager.split(',') : [],
    zoneIds: sp?.zone ? sp.zone.split(',') : [],
  };

  const [{ data: artists, totalPages }, languages, countries, artistManagers, zones] = await Promise.all([
    getPaginatedArtists(filters),
    getLanguages(),
    getCountries(),
    getArtistManagers(),
    getZones(),
  ]).catch((error) => {
    console.error('❌ Error fetching:', error);
    notFound();
  });

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Artisti</h1>
        <div className='flex items-center gap-2 md:gap-4 mt-2 md:mt-0'>
          {(artists.length > 0 || showFilters) && (
            <FiltersButton
              filters={filters}
              showFilters={showFilters}
              artistManagers={artistManagers}
            />
          )}
          <CreateButton
            languages={languages}
            countries={countries}
            zones={zones}
            artistManagers={artistManagers}
          />
        </div>
      </div>
      {/* artists table section */}
      {artists.length > 0 ? (
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
                <div>Manager</div>
                <div className='hidden md:block'>{showFilters && <ArtistManagerFilter artistManagers={artistManagers} />}</div>
              </TableHead>
              <TableHead>
                <div>Area di interesse</div>
                <div className='hidden md:block'>{showFilters && <ZoneFilter zones={zones} />}</div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {artists.map((artist, index) => {
              const isDisabled = artist.status === 'disabled';
              const isNew = new Date().getTime() - new Date(artist.createdAt).getTime() < NEW_USER_TIME;

              const badgeStatus = isDisabled ? 'disabled' : isNew ? 'new' : undefined;

              return (
                <TableRow
                  key={index}
                  className={isDisabled ? 'text-zinc-400' : ''}
                >
                  <TableCell>
                    <div className='flex items-center flex-nowrap gap-3'>
                      <UserBadge
                        name={artist.name}
                        surname={artist.surname}
                        avatarUrl={artist.avatarUrl}
                        isDisabled={isDisabled}
                        href={`/artisti/${artist.slug}`}
                      />
                      {badgeStatus && <StatusBadge status={badgeStatus} />}
                    </div>
                  </TableCell>
                  <TableCell>{artist.email}</TableCell>
                  <TableCell>{artist.phone}</TableCell>
                  <TableCell>
                    <ManagersBadge
                      managers={artist.managers}
                      pathSegment='manager-artisti'
                    />
                  </TableCell>
                  <TableCell>
                    <ZonesBadge zones={artist.zones} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun artista</h2>
          <div className='text-sm font-medium text-zinc-400'>Aggiungine uno per vederlo nella lista</div>
        </section>
      )}
      {artists.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
