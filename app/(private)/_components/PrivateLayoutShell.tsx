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

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
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
      <div className='flex-1 min-h-0 grid grid-rows-1 md:grid-cols-[max-content_1fr] md:gap-6 px-4 pb-4 pt-3 md:px-8 md:pb-6 md:pt-5 overflow-hidden'>
        <nav
          className={cn(
            'hidden max-h-max md:flex flex-col gap-1 bg-white rounded-2xl transition-all',
            isNavCollapsed ? 'w-14 p-2 items-center' : 'w-52 p-4',
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
        <main className='min-h-0 min-w-0 flex flex-col gap-2 md:gap-4 overflow-y-auto overscroll-contain'>
          {children}
        </main>
      </div>
    </>
  );
}
