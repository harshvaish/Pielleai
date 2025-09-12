import { unstable_cache } from 'next/cache';
import { getVenues } from '../data/venues/get-venues';
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

export function getVenuesCached(profileId?: number) {
  const key = ['venues'];

  const fn = unstable_cache(
    async (p) => getVenues(p),
    key,
    { revalidate: 60 * 60, tags: key }, // 1d
  );

  return fn(profileId);
}
