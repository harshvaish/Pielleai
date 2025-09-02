import getSession from '@/lib/data/auth/get-session';
import { getProfile } from '@/lib/data/profiles/get-profile';
import { resolveNextPath } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { session, user } = await getSession();

  if (!session || !user) redirect('/accedi');

  const profile = await getProfile(user.id);

  const target = resolveNextPath({ user: user, hasProfile: Boolean(profile) });

  if (target !== '/completa-profilo') redirect(target);

  return children;
}
