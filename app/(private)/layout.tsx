import Header from '../_components/Header';
import { NAVBAR_LINKS } from '@/lib/constants';
import getSession from '@/lib/data/auth/get-session';
import { redirect } from 'next/navigation';
import NavbarLink from '../_components/NavbarLink';
import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react';

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
            const visible = link.visibleTo.includes(user.role);

            return (
              visible && (
                <Fragment key={link.label}>
                  <NavbarLink link={link} />
                  {link.separator && <Separator />}
                </Fragment>
              )
            );
          })}
        </nav>
        <main className='flex flex-col gap-3 md:gap-6 overflow-y-auto'>{children}</main>
      </div>
    </>
  );
}
