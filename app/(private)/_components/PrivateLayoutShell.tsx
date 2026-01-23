'use client';

import { Fragment, useEffect, useState } from 'react';
import { NAVBAR_LINKS } from '@/lib/constants';
import NavbarLink from '@/app/_components/NavbarLink';
import { Separator } from '@/components/ui/separator';
import Header from '@/app/_components/Header';
import { User } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV_COLLAPSE_KEY = 'mo-nav-collapsed';

type PrivateLayoutShellProps = {
  user: User;
  children: React.ReactNode;
};

export default function PrivateLayoutShell({ user, children }: PrivateLayoutShellProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(NAV_COLLAPSE_KEY);
    if (stored === 'true') setIsNavCollapsed(true);
  }, []);

  const toggleNav = () => {
    setIsNavCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(NAV_COLLAPSE_KEY, String(next));
      return next;
    });
  };

  return (
    <>
      <Header
        user={user}
        onToggleNav={toggleNav}
        isNavCollapsed={isNavCollapsed}
      />
      <div className='flex-grow grid md:grid-cols-[max-content_1fr] md:gap-8 p-4 md:p-8 overflow-hidden'>
        <nav
          className={cn(
            'hidden max-h-max md:flex flex-col gap-1 bg-white rounded-2xl transition-all',
            isNavCollapsed ? 'w-16 p-2 items-center' : 'w-60 p-4',
          )}
        >
          {NAVBAR_LINKS.map((link) => {
            const visible = link.visibleTo.includes(user.role);

            return (
              visible && (
                <Fragment key={link.label}>
                  <NavbarLink
                    link={link}
                    collapsed={isNavCollapsed}
                  />
                  {link.separator && <Separator className={isNavCollapsed ? 'w-full' : ''} />}
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
