import { unstable_cache } from 'next/cache';
import { getVenues } from '../data/venues/get-venues';
import { VenuesTableFilters } from '../types';
import { getPaginatedVenues } from '../data/venues/get-paginated-venues';
import { hashKey } from '../utils';
import { getVenue } from '../data/venues/get-venue';

export function getVenueCached(slug: string) {
  const key = ['venue', slug];

  const fn = unstable_cache(
    (s: string) => getVenue(s),
    key,
    { revalidate: 60, tags: [`venue:${slug}`] }, // 1 min + tag
  );
  return fn(slug);
}

export const getVenuesCached = unstable_cache(
  async () => getVenues(),
  ['venues'],
  { revalidate: 60 * 60, tags: ['venues'] }, // 1d
);

// NOTE: we derive key from filters so pages/filters cache separately
export async function getPaginatedVenuesCached(filters: VenuesTableFilters) {
  const key = [
    'paginated-venues',
    hashKey({
      currentPage: filters.currentPage,
      name: filters.name,
      company: filters.company,
      taxCode: filters.taxCode,
      address: filters.address,
      types: filters.types,
      managerIds: filters.managerIds,
      capacity: filters.capacity,
    }),
  ];

  const fn = unstable_cache(async (f: VenuesTableFilters) => getPaginatedVenues(f), key, {
    revalidate: 60, // 1 min
    tags: ['paginated-venues'],
  });
  return fn(filters);
}
