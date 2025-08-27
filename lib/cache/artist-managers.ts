import { unstable_cache } from 'next/cache';
import { getArtistManagers } from '@/lib/data/artist-managers/get-artist-managers';
import { ArtistManagersTableFilters } from '../types';
import { hashKey } from '../utils';
import { getPaginatedArtistManagers } from '../data/artist-managers/get-paginated-artist-managers';
import { getArtistManager } from '../data/artist-managers/get-artist-manager';

export function getArtistManagerCached(uid: string) {
  const key = ['artist-manager', uid];

  const fn = unstable_cache(
    (u: string) => getArtistManager(u),
    key,
    { revalidate: 60, tags: [`artist-manager:${uid}`] }, // 1 min + tag
  );
  return fn(uid);
}

export const getArtistManagersCached = unstable_cache(
  async () => getArtistManagers(),
  ['artist-managers'],
  { revalidate: 60 * 60, tags: ['artist-managers'] }, // 1h
);

// NOTE: we derive key from filters so pages/filters cache separately
export async function getPaginatedArtistManagersCached(filters: ArtistManagersTableFilters) {
  const key = [
    'paginated-artist-managers',
    hashKey({
      currentPage: filters.currentPage,
      fullName: filters.fullName,
      email: filters.email,
      phone: filters.phone,
      artistIds: filters.artistIds,
      company: filters.company,
    }),
  ];

  const fn = unstable_cache(
    async (f: ArtistManagersTableFilters) => getPaginatedArtistManagers(f),
    key,
    {
      revalidate: 60, // 1 min
      tags: ['paginated-artist-managers'],
    },
  );
  return fn(filters);
}
