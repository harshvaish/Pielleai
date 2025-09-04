import { unstable_cache } from 'next/cache';
import { getUsersToApprove } from '@/lib/data/users/get-users-to-approve';
import { getUserProfileId } from '../data/profiles/get-user-profile-id';

export const getUsersToApproveCached = unstable_cache(
  async () => getUsersToApprove(),
  ['users-to-approve'],
  { revalidate: 30, tags: ['users-to-approve'] }, // 30s
);

export function getUserProfileIdCached(uid: string) {
  const key = ['profile', uid];

  const fn = unstable_cache(
    (id: string) => getUserProfileId(id),
    key,
    { revalidate: 30, tags: [`profile:${uid}`] }, // 30s + tag
  );
  return fn(uid);
}
