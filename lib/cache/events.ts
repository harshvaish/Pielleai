import { EventsTableFilters } from '@/lib/types';
import { hashKey } from '@/lib/utils';
import { unstable_cache } from 'next/cache';
import { getEvents } from '@/lib/data/events/get-events';

export async function getEventsCached(filters: EventsTableFilters) {
  const key = [
    'paginated-events',
    hashKey({
      currentPage: filters.currentPage,
      status: filters.status,
      artistIds: filters.artistIds,
      artistManagerIds: filters.artistManagerIds,
      venueIds: filters.venueIds,
      startDate: filters.startDate,
      endDate: filters.endDate,
    }),
  ];
  const fn = unstable_cache(async (f: EventsTableFilters) => getEvents(f), key, {
    revalidate: 30,
    tags: ['paginated-events'],
  });
  return fn(filters);
}
