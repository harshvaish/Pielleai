import Header from '../_components/Header';
import { NAVBAR_LINKS } from '@/lib/constants';
import getSession from '@/lib/data/auth/get-session';
import { redirect } from 'next/navigation';
import NavbarLink from '../_components/NavbarLink';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  return (
    <>
      <Header user={user} />
      <div className='flex-grow grid md:grid-cols-[max-content_1fr] md:gap-8 p-4 md:p-8 overflow-hidden'>
        {/* sidebar */}
        <nav className='hidden w-60 max-h-max md:flex flex-col gap-1 bg-white p-4 rounded-2xl'>
          {NAVBAR_LINKS.map((link) => {
            const visible = link.canAccess.includes(user.role);

            return (
              visible && (
                <NavbarLink
                  key={link.label}
                  link={link}
                />
              )
            );
          })}
        </nav>
        <main className='flex flex-col gap-3 md:gap-6 overflow-y-auto'>{children}</main>
      </div>
    </>
  );
}
