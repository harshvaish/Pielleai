import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { notFound } from 'next/navigation';
import { NEW_USER_TIME } from '@/lib/constants';
import { TablePagination } from '../_components/TablePagination';
import ToggleFiltersButton from '../_components/ToggleFiltersButton';
import UserBadge from '../_components/UserBadge';
import StatusBadge from '../_components/StatusBadge';
import FilterInput from '../_components/FilterInput';
import { getPaginatedArtists } from '@/lib/data/artists/get-paginated-artists';
import CreateArtistButton from './_components/CreateArtistButton';
import { getZones } from '@/lib/data/artists/get-zones';
import { getArtistManagers } from '@/lib/data/artists/get-artist-managers';
import ZonesBadge from './_components/ZonesBadge';
import ArtistManagersBadge from './_components/ArtistManagersBadge';

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    fullName?: string;
    email?: string;
    phone?: string;
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
  };

  const [
    { data: artists, totalPages },
    languages,
    countries,
    zones,
    artistManagers,
  ] = await Promise.all([
    getPaginatedArtists(filters),
    getLanguages(),
    getCountries(),
    getZones(),
    getArtistManagers(),
  ]).catch((error) => {
    console.error('❌ Error fetching:', error);
    notFound();
  });

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Artisti</h1>
        <div className='flex items-center gap-4'>
          {artists.length > 0 && (
            <ToggleFiltersButton showFilters={showFilters} />
          )}
          <CreateArtistButton
            languages={languages}
            countries={countries}
            zones={zones}
            artistManagers={artistManagers}
          />
        </div>
      </div>
      {/* artists table section */}
      {artists.length > 0 ? (
        <section className='bg-white overflow-auto rounded-2xl border group-has-[[data-pending]]:animate-pulse'>
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
                <TableHead>Manager</TableHead>
                <TableHead>Area di interesse</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {artists.map((artist, index) => {
                const isDisabled = artist.status === 'disabled';
                const isNew =
                  new Date().getTime() - new Date(artist.createdAt).getTime() <
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
                      <ArtistManagersBadge managers={artist.managers} />
                    </TableCell>
                    <TableCell>
                      <ZonesBadge zones={artist.zones} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>
      ) : (
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun artista</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
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
