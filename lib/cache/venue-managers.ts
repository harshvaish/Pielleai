import { unstable_cache } from 'next/cache';
import { getVenueManagers } from '../data/venue-managers/get-venue-managers';
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
