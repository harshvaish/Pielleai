import { unstable_cache } from 'next/cache';
import { getUsersToApprove } from '@/lib/data/users/get-users-to-approve';

export const getUsersToApproveCached = unstable_cache(
  async () => getUsersToApprove(),
  ['users-to-approve'],
  { revalidate: 30, tags: ['users-to-approve'] }, // 30s
);
