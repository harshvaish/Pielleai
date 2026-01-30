import getSession from '@/lib/data/auth/get-session';
import { redirect } from 'next/navigation';
import PrivateLayoutShell from './_components/PrivateLayoutShell';

export const dynamic = 'force-dynamic';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getSession(true);

  if (!session || !user) {
    redirect('/accedi');
  }

  if (user.banned) {
    redirect('/logout');
  }

  return (
    <PrivateLayoutShell user={user}>{children}</PrivateLayoutShell>
  );
}
