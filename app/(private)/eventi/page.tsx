import CreateButton from './_components/create/CreateButton';
import { TablePagination } from '../_components/form/TablePagination';
import EventTile from '../_components/EventTile/EventTile';
import StatusFilterButton from './_components/filters/StatusFilterButton';
import FiltersButton from './_components/filters/FiltersButton';
import { EventsTableFilters, EventStatus } from '@/lib/types';
import DatesFilterButton from './_components/filters/DatesFilterButton';
import { hasRole, resolveNextPath, splitCsv } from '@/lib/utils';
import { getArtistsCached } from '@/lib/cache/artists';
import { getArtistManagersCached } from '@/lib/cache/artist-managers';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';
import { getProfessionalsCached } from '@/lib/cache/professionals';
import { getVenuesCached } from '@/lib/cache/venues';
import { eventsFiltersSchema } from '@/lib/validation/filters/events-filters-schema';
import { notFound, redirect } from 'next/navigation';
import ExportButton from './_components/ExportButton';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { getEvents } from '@/lib/data/events/get-events';
import ConflictFilterButton from './_components/filters/ConflictFilterButton';

type EventsPageProps = {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    conflict?: string;
    artist?: string;
    manager?: string;
    venue?: string;
    start?: string;
    end?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function EventsPage({ searchParams }: EventsPageProps) {
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

  const filters: EventsTableFilters = {
    currentPage: currentPage,
    status: splitCsv(sp?.status) as EventStatus[],
    conflict: sp?.conflict === 'true',
    artistIds: splitCsv(sp?.artist),
    artistManagerIds: splitCsv(sp?.manager),
    venueIds: splitCsv(sp?.venue),
    startDate: sp?.start ? new Date(sp.start) : null,
    endDate: sp?.end ? new Date(sp.end) : null,
  };
  const validation = eventsFiltersSchema.safeParse(filters);

  if (!validation.success) {
    notFound();
  }

  const [
    { data: events, totalPages },
    artists,
    artistManagers,
    venues,
    moCoordinators,
    professionals,
  ] = await Promise.all([
    getEvents(user, filters),
    getArtistsCached(isArtistManager ? profileId! : undefined),
    isAdmin ? getArtistManagersCached() : Promise.resolve([]),
    getVenuesCached(isVenueManager ? profileId! : undefined),
    isAdmin ? getMoCoordinatorsCached() : Promise.resolve([]),
    isAdmin ? getProfessionalsCached() : Promise.resolve([]),
  ]);
  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-2'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='text-xl md:text-2xl font-bold'>Eventi</h1>
          <div className='max-w-full bg-white flex items-center gap-1 p-0.5 rounded-xl overflow-auto'>
            <StatusFilterButton
              status='proposed'
              label='Proposto'
            />
            <StatusFilterButton
              status='pre-confirmed'
              label='Pre confermato'
            />
            <StatusFilterButton
              status='confirmed'
              label='Confermato'
            />
            <StatusFilterButton
              status='rejected'
              label='Rifiutato'
            />
            <StatusFilterButton
              status='ended'
              label='Finito'
            />
            <StatusFilterButton
              status='cancelled'
              label='Annullato'
            />
            <StatusFilterButton
              status='in-dispute'
              label='Contestazione legale'
            />
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          {isAdmin && <ExportButton filters={filters} />}
          {(isAdmin || isVenueManager) && (
            <CreateButton
              userRole={user.role}
              artists={artists}
              venues={venues}
              moCoordinators={isAdmin ? moCoordinators : undefined}
              professionals={isAdmin ? professionals : undefined}
              forceLink
            />
          )}
          {isAdmin && <ConflictFilterButton />}
          <FiltersButton
            userRole={user.role}
            filters={filters}
            artists={artists}
            artistManagers={artistManagers}
            venues={venues}
          />
          <DatesFilterButton filters={filters} />
        </div>
      </div>

      {/* events table section */}
      {events.length > 0 ? (
        <div className='max-h-full flex flex-col divide-y divide-zinc-200 bg-white p-3 overflow-auto rounded-2xl'>
          {events.map((event) => (
            <EventTile
              key={event.id}
              userRole={user.role}
              event={event}
              artists={artists}
              venues={venues}
            />
          ))}
        </div>
      ) : (
        <section className='flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun evento</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
        </section>
      )}
      {events.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
