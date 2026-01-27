import { unstable_cache } from 'next/cache';
import { getProfessionals } from '../data/professionals/get-professionals';

export function getProfessionalsCached() {
  const key = ['professionals'];

  const fn = unstable_cache(
    () => getProfessionals(),
    key,
    { revalidate: 60 * 60, tags: key },
  );

  return fn();
}
