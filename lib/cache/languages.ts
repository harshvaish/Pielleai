import { unstable_cache } from 'next/cache';
import { getLanguages } from '@/lib/data/get-languages';

export const getLanguagesCached = unstable_cache(
  async () => getLanguages(),
  ['languages'],
  { revalidate: 60 * 60 * 24 * 7, tags: ['languages'] }, // 7d
);
