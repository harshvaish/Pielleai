import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '../_components/form/TablePagination';
import { AVATAR_FALLBACK, NEW_USER_TIME } from '@/lib/constants';
import FiltersButton from './_components/filters/FiltersButton';
import { ArtistManagersTableFilters } from '@/lib/types';
import CreateButton from './_components/create/CreateButton';
import { hasRole, resolveNextPath, splitCsv } from '@/lib/utils';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getArtistsCached } from '@/lib/cache/artists';
import { notFound, redirect } from 'next/navigation';
import { artistManagersTableFiltersSchema } from '@/lib/validation/filters/artist-managers-table-filters-schema';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { getPaginatedArtistManagers } from '@/lib/data/artist-managers/get-paginated-artist-managers';
import UserBadge from '../_components/Badges/UserBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import ArtistsBadge from '../_components/Badges/ArtistsBadge';

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

export const dynamic = 'force-dynamic';

export default async function ArtistManagersPage({ searchParams }: ArtistManagersPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin'])) {
    notFound();
  }

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? '1');

  const filters: ArtistManagersTableFilters = {
    currentPage: currentPage,
    fullName: sp?.fullName || null,
    email: sp?.email || null,
    phone: sp?.phone || null,
    artistIds: splitCsv(sp?.artist),
    company: sp?.company || null,
  };

  const validation = artistManagersTableFiltersSchema.safeParse(filters);

  if (!validation.success) {
    notFound();
  }

  const [{ data: managers, totalPages }, languages, countries, artists] = await Promise.all([
    getPaginatedArtistManagers(filters),
    getLanguagesCached(),
    getCountriesCached(),
    getArtistsCached(),
  ]);

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
              const isNew =
                new Date().getTime() - new Date(manager.createdAt).getTime() < NEW_USER_TIME;

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
                        avatarUrl={manager.avatarUrl || AVATAR_FALLBACK}
                        isDisabled={isDisabled}
                        href={`/manager-artisti/${manager.id}`}
                      />
                      {badgeStatus && <StatusBadge status={badgeStatus} />}
                    </div>
                  </TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.phone}</TableCell>
                  <TableCell>
                    <ArtistsBadge
                      artists={manager.artists}
                      userRole={user.role}
                    />
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
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
