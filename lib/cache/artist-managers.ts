import { unstable_cache } from 'next/cache';
import { getArtistManagers } from '@/lib/data/artist-managers/get-artist-managers';
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
