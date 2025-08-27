import { unstable_cache } from 'next/cache';
import { getZones } from '@/lib/data/artists/get-zones';

export const getZonesCached = unstable_cache(
  async () => getZones(),
  ['zones'],
  { revalidate: 60 * 60, tags: ['zones'] }, // 1h
);
