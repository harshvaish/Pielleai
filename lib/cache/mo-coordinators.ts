import { unstable_cache } from 'next/cache';
import { getMoCoordinators } from '../data/get-mo-coordinators';

export const getMoCoordinatorsCached = unstable_cache(
  async () => getMoCoordinators(),
  ['mo-coordinators'],
  { revalidate: 60 * 60 * 24 * 7, tags: ['mo-coordinators'] }, // 7d
);
