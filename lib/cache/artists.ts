// lib/data/cache.ts
import { unstable_cache } from 'next/cache';
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

export function getArtistsCached(managerProfileId?: number) {
  const key = ['artists'];

  const fn = unstable_cache(
    (id: number | undefined) => getArtists(id),
    key,
    { revalidate: 60 * 60, tags: key }, // 1 hour
  );
  return fn(managerProfileId);
}
