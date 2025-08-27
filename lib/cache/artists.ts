// lib/data/cache.ts
import { unstable_cache } from 'next/cache';
import { getPaginatedArtists } from '@/lib/data/artists/get-paginated-artists';
import type { ArtistsTableFilters } from '@/lib/types';
import { hashKey } from '../utils';
import { getArtists } from '../data/artists/get-artists';
import { getArtist } from '../data/artists/get-artist';

export function getArtistCached(slug: string) {
  const key = ['artist', slug];

  const fn = unstable_cache(
    (s: string) => getArtist(s),
    key,
    { revalidate: 60, tags: [`artist:${slug}`] }, // 1 min + tag
  );
  return fn(slug);
}

export const getArtistsCached = unstable_cache(
  async () => getArtists(),
  ['artists'],
  { revalidate: 60 * 60, tags: ['artists'] }, // 1h
);

// NOTE: we derive key from filters so pages/filters cache separately
export async function getPaginatedArtistsCached(filters: ArtistsTableFilters) {
  const key = [
    'paginated-artists',
    hashKey({
      page: filters.currentPage,
      fullName: filters.fullName,
      email: filters.email,
      phone: filters.phone,
      managerIds: filters.managerIds,
      zoneIds: filters.zoneIds,
    }),
  ];

  const fn = unstable_cache(async (f: ArtistsTableFilters) => getPaginatedArtists(f), key, {
    revalidate: 60, // 1 min
    tags: ['paginated-artists'],
  });
  return fn(filters);
}
