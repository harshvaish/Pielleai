import { unstable_cache } from 'next/cache';
import { getUserProfileId } from '../data/profiles/get-user-profile-id';

export function getUserProfileIdCached(uid: string) {
  const key = ['profile', uid];

  const fn = unstable_cache(
    (id: string) => getUserProfileId(id),
    key,
    { revalidate: 30, tags: [`profile:${uid}`] }, // 30s + tag
  );
  return fn(uid);
}
