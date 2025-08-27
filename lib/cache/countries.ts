import { unstable_cache } from 'next/cache';
import { getCountries } from '@/lib/data/get-countries';

export const getCountriesCached = unstable_cache(
  async () => getCountries(),
  ['countries'],
  { revalidate: 60 * 60 * 24 * 7, tags: ['countries'] }, // 7d
);
