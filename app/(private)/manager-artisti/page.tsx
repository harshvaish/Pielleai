import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPaginatedArtistManagers } from '@/lib/data/artist-managers/get-paginated-artist-managers';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { TablePagination } from '../_components/form/TablePagination';
import UserBadge from '../_components/Badges/UserBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import { NEW_USER_TIME } from '@/lib/constants';
import ArtistsBadge from '../_components/Badges/ArtistsBadge';
import { getArtists } from '@/lib/data/artists/get-artists';
import FiltersButton from './_components/filters/FiltersButton';
import { ArtistManagersTableFilters } from '@/lib/types';
import CreateButton from './_components/create/CreateButton';
import { splitCsv } from '@/lib/utils';

type ArtistManagersPageProps = {
  searchParams?: Promise<{
    page?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    artist?: string;
    company?: string;
  }>;
};

export default async function ArtistManagersPage({ searchParams }: ArtistManagersPageProps) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');

  const filters: ArtistManagersTableFilters = {
    currentPage: currentPage,
    fullName: sp?.fullName || '',
    email: sp?.email || '',
    phone: sp?.phone || '',
    artistIds: splitCsv(sp?.artist),
    company: sp?.company || '',
  };

  const [{ data: managers, totalPages }, languages, countries, artists] = await Promise.all([getPaginatedArtistManagers(filters), getLanguages(), getCountries(), getArtists()]);

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Manager Artisti</h1>
        <div className='flex items-center gap-2 mt-2 md:mt-0'>
          <FiltersButton
            filters={filters}
            artists={artists}
          />

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
              <TableHead>Nome completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Numero di telefono</TableHead>
              <TableHead>Artisti</TableHead>
              <TableHead>Ragione sociale</TableHead>
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
