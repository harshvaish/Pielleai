import { unstable_cache } from 'next/cache';
import { getVenueManagers } from '../data/venue-managers/get-venue-managers';
import { VenueManagersTableFilters } from '../types';
import { hashKey } from '../utils';
import { getPaginatedVenueManagers } from '../data/venue-managers/get-paginated-venue-managers';
import { getVenueManager } from '../data/venue-managers/get-venue-manager';

export function getVenueManagerCached(uid: string) {
  const key = ['venue-manager', uid];

  const fn = unstable_cache(
    (u: string) => getVenueManager(u),
    key,
    { revalidate: 60, tags: [`venue-manager:${uid}`] }, // 1 min + tag
  );
  return fn(uid);
}

export const getVenueManagersCached = unstable_cache(
  async () => getVenueManagers(),
  ['venue-managers'],
  { revalidate: 60 * 60, tags: ['venue-managers'] }, // 1h
);

// NOTE: we derive key from filters so pages/filters cache separately
export async function getPaginatedVenueManagersCached(filters: VenueManagersTableFilters) {
  const key = [
    'paginated-venue-managers',
    hashKey({
      currentPage: filters.currentPage,
      fullName: filters.fullName,
      email: filters.email,
      phone: filters.phone,
      venueIds: filters.venueIds,
    }),
  ];

  const fn = unstable_cache(
    async (f: VenueManagersTableFilters) => getPaginatedVenueManagers(f),
    key,
    {
      revalidate: 60, // 1 min
      tags: ['paginated-venue-managers'],
    },
  );
  return fn(filters);
}
