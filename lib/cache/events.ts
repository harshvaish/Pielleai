import { EventsTableFilters } from '@/lib/types';
import { hashKey } from '@/lib/utils';
import { unstable_cache } from 'next/cache';
import { getEvents } from '@/lib/data/events/get-events';
import { User } from '../auth';
import { getEventsToApprove } from '../data/events/get-events-to-approve';

export async function getEventsCached(user: User, filters: EventsTableFilters) {
  const key = [
    'paginated-events',
    hashKey({
      uid: user.id,
      currentPage: filters.currentPage,
      status: filters.status,
      artistIds: filters.artistIds,
      artistManagerIds: filters.artistManagerIds,
      venueIds: filters.venueIds,
      startDate: filters.startDate,
      endDate: filters.endDate,
    }),
  ];
  const fn = unstable_cache(async (u: User, f: EventsTableFilters) => getEvents(u, f), key, {
    revalidate: 30,
    tags: ['paginated-events'],
  });
  return fn(user, filters);
}

export const getEventsToApproveCached = unstable_cache(
  async () => getEventsToApprove(),
  ['events-to-approve'],
  { revalidate: 30, tags: ['events-to-approve'] }, // 30s
);
