import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '../_components/form/TablePagination';
import UserBadge from '../_components/badges/UserBadge';
import ManagersBadge from '../_components/badges/ManagersBadge';
import VenueTypeBadge from '../_components/badges/VenueTypeBadge';
import { NEW_USER_TIME } from '@/lib/constants';
import { VenuesTableFilters, VenueType } from '@/lib/types';
import FiltersButton from './_components/filters/FiltersButton';
import CreateButton from './_components/create/CreateButton';
import StatusBadge from '../_components/badges/StatusBadge';
import { hasRole, resolveNextPath, splitCsv } from '@/lib/utils';
import { getCountriesCached } from '@/lib/cache/countries';
import { getVenueManagersCached } from '@/lib/cache/venue-managers';
import { getPaginatedVenuesCached } from '@/lib/cache/venues';
import { notFound, redirect } from 'next/navigation';
import { venuesTableFiltersSchema } from '@/lib/validation/filters/venues-table-filters-schema';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';

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
  if (!session || !user) redirect('/accedi');

  if (!hasRole(user, ['admin', 'venue-manager'])) {
    notFound();
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  const sp = await searchParams;

  const currentPage = Number(sp?.page ?? '1');

  const filters: VenuesTableFilters = {
    currentPage: currentPage,
    name: sp?.name || null,
    company: sp?.company || null,
    taxCode: sp?.taxCode || null,
    address: sp?.address || null,
    types: splitCsv(sp?.type) as VenueType[],
    managerIds: splitCsv(sp?.manager),
    capacity: sp?.capacity || null,
  };

  const validation = venuesTableFiltersSchema.safeParse(filters);

  if (!validation.success) {
    notFound();
  }

  const [{ data: venues, totalPages }, countries, venueManagers] = await Promise.all([
    getPaginatedVenuesCached(filters),
    getCountriesCached(),
    getVenueManagersCached(),
  ]);

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
                        avatarUrl={venue.avatarUrl}
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
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
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
