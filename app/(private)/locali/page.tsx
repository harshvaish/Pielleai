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
import { VenuesTableFilters, VenueType } from '@/lib/types';
import FiltersButton from './_components/filters/FiltersButton';
import CreateButton from './_components/create/CreateButton';
import { hasRole, resolveNextPath, splitCsv } from '@/lib/utils';
import { getCountriesCached } from '@/lib/cache/countries';
import { getVenueManagersCached } from '@/lib/cache/venue-managers';
import { notFound, redirect } from 'next/navigation';
import { venuesTableFiltersSchema } from '@/lib/validation/filters/venues-table-filters-schema';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { getPaginatedVenues } from '@/lib/data/venues/get-paginated-venues';
import UserBadge from '../_components/Badges/UserBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import VenueTypeBadge from '../_components/Badges/VenueTypeBadge';
import ManagersBadge from '../_components/Badges/ManagersBadge';
import VenueCard from './_components/VenueCard';

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

export const dynamic = 'force-dynamic';

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'venue-manager', 'artist-manager'])) {
    notFound();
  }

  const isAdmin = user.role === 'admin';
  const isVenueManager = user.role === 'venue-manager';
  const isArtistManager = user.role === 'artist-manager';

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? '1');

  const managersFilter = isAdmin
    ? splitCsv(sp?.manager)
    : isVenueManager
      ? [profileId!.toString()]
      : [];

  const filters: VenuesTableFilters = {
    currentPage: currentPage,
    name: isArtistManager ? null : sp?.name || null,
    company: isArtistManager ? null : sp?.company || null,
    taxCode: isArtistManager ? null : sp?.taxCode || null,
    address: isArtistManager ? null : sp?.address || null,
    types: isArtistManager ? [] : (splitCsv(sp?.type) as VenueType[]),
    managerIds: isArtistManager ? [] : managersFilter,
    capacity: isArtistManager ? null : sp?.capacity || null,
  };

  const validation = venuesTableFiltersSchema.safeParse(filters);

  if (!validation.success) {
    notFound();
  }

  const [{ data: venues, totalPages }, countries, venueManagers] = await Promise.all([
    getPaginatedVenues(filters),
    isArtistManager ? Promise.resolve([]) : getCountriesCached(),
    isArtistManager ? Promise.resolve([]) : getVenueManagersCached(),
  ]);

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Locali</h1>
        {!isArtistManager && (
          <div className='flex items-center gap-2 md:gap-4 mt-2 md:mt-0'>
            <FiltersButton
              userRole={user.role}
              filters={filters}
              venueManagers={venueManagers}
            />

            <CreateButton
              userRole={user.role}
              userProfileId={profileId as number}
              countries={countries}
              venueManagers={venueManagers}
            />
          </div>
        )}
      </div>
      {/* venues table section */}
      {venues.length > 0 ? (
        isArtistManager ? (
          <div className='grid xl:grid-cols-2 gap-8'>
            {venues.map((venue, index) => (
              <VenueCard
                key={index}
                venue={venue}
              />
            ))}
          </div>
        ) : (
          <Table className='w-full'>
            <TableHeader className='bg-zinc-50'>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ragione sociale</TableHead>
                <TableHead>Codice fiscale</TableHead>
                <TableHead>Indirizzo</TableHead>
                <TableHead>Tipologia</TableHead>
                <TableHead>Promoter</TableHead>
                <TableHead>Capienza</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {venues.map((venue, index) => {
                const isDisabled = venue.status === 'disabled';

                const isNew =
                  new Date().getTime() - new Date(venue.createdAt).getTime() < NEW_USER_TIME;

                const badgeStatus = isDisabled ? 'disabled' : isNew ? 'new' : undefined;

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
                          avatarUrl={venue.avatarUrl || AVATAR_FALLBACK}
                          isDisabled={isDisabled}
                          href={`/locali/${venue.slug}`}
                        />
                        {badgeStatus && <StatusBadge status={badgeStatus} />}
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
                        userRole={user.role}
                        managers={venue.manager ? [venue.manager] : []}
                        pathSegment='promoter-locali'
                      />
                    </TableCell>
                    <TableCell>{venue.capacity}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )
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
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
