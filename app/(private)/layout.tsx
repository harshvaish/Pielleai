import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../_components/Header';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    await auth.api
      .signOut({
        headers: requestHeaders,
      })
      .catch((error) => console.error(error));

    redirect('/accedi');
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
