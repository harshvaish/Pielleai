import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NEW_USER_TIME } from '@/lib/constants';
import { TablePagination } from '../_components/form/TablePagination';
import { ArtistsTableFilters } from '@/lib/types';
import FiltersButton from './_components/filters/FiltersButton';
import CreateButton from './_components/create/CreateButton';
import { hasRole, resolveNextPath, splitCsv } from '@/lib/utils';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getArtistManagersCached } from '@/lib/cache/artist-managers';
import { getZonesCached } from '@/lib/cache/zones';
import { artistsTableFiltersSchema } from '@/lib/validation/filters/artists-table-filters-schema';
import { notFound, redirect } from 'next/navigation';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { getPaginatedArtists } from '@/lib/data/artists/get-paginated-artists';
import ArtistsBadge from '../_components/Badges/ArtistsBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import ManagersBadge from '../_components/Badges/ManagersBadge';
import ZonesBadge from '../_components/Badges/ZonesBadge';
import ArtistCard from './_components/ArtistCard';

export const dynamic = 'force-dynamic';

type ArtistsPageProps = {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    manager?: string;
    zone?: string;
  }>;
};

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'artist-manager', 'venue-manager'])) {
    notFound();
  }

  const isAdmin = user.role === 'admin';
  const isArtistManager = user.role === 'artist-manager';
  const isVenueManager = user.role === 'venue-manager';

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? '1');

  const managersFilter = isAdmin
    ? splitCsv(sp?.manager)
    : isArtistManager
      ? [profileId!.toString()]
      : [];

  const filters: ArtistsTableFilters = {
    currentPage: currentPage,
    fullName: isVenueManager ? null : sp?.fullName || null,
    email: isVenueManager ? null : sp?.email || null,
    phone: isVenueManager ? null : sp?.phone || null,
    managerIds: isVenueManager ? [] : managersFilter,
    zoneIds: isVenueManager ? [] : splitCsv(sp?.zone),
  };

  const validation = artistsTableFiltersSchema.safeParse(filters);

  if (!validation.success) {
    notFound();
  }

  const [{ data: artists, totalPages }, languages, countries, artistManagers, zones] =
    await Promise.all([
      getPaginatedArtists(filters),
      isVenueManager ? Promise.resolve([]) : getLanguagesCached(),
      isVenueManager ? Promise.resolve([]) : getCountriesCached(),
      isVenueManager ? Promise.resolve([]) : getArtistManagersCached(),
      isVenueManager ? Promise.resolve([]) : getZonesCached(),
    ]);

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Artisti</h1>
        {!isVenueManager && (
          <div className='flex items-center gap-2 mt-2 md:mt-0'>
            <FiltersButton
              isAdmin={isAdmin}
              filters={filters}
              artistManagers={artistManagers}
              zones={zones}
            />

            <CreateButton
              userRole={user.role}
              userProfileId={profileId as number}
              languages={languages}
              countries={countries}
              zones={zones}
              artistManagers={artistManagers}
            />
          </div>
        )}
      </div>

      {/* artists table section */}
      {artists.length > 0 ? (
        isVenueManager ? (
          <div className='grid xl:grid-cols-2 gap-8'>
            {artists.map((artist, index) => (
              <ArtistCard
                key={index}
                artist={artist}
              />
            ))}
          </div>
        ) : (
          <Table className='w-full'>
            <TableHeader className='bg-zinc-50'>
              <TableRow>
                <TableHead>Nome completo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Numero di telefono</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Area di interesse</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {artists.map((artist, index) => {
                const isDisabled = artist.status === 'disabled';
                const isNew =
                  new Date().getTime() - new Date(artist.createdAt).getTime() < NEW_USER_TIME;

                const badgeStatus = isDisabled ? 'disabled' : isNew ? 'new' : undefined;

                return (
                  <TableRow
                    key={index}
                    className={isDisabled ? 'text-zinc-400' : ''}
                  >
                    <TableCell>
                      <div className='flex items-center flex-nowrap gap-3'>
                        <ArtistsBadge
                          artists={[artist]}
                          userRole={user.role}
                        />
                        {badgeStatus && <StatusBadge status={badgeStatus} />}
                      </div>
                    </TableCell>
                    <TableCell>{artist.email}</TableCell>
                    <TableCell>{artist.phone}</TableCell>
                    <TableCell>
                      <ManagersBadge
                        userRole={user.role}
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
        )
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
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
