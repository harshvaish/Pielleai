'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, SquareArrowOutUpRight, UserRound } from 'lucide-react';
import { useState } from 'react';
import ChangePasswordButton from './ChangePassword/ChangePaswordButton';
import { Separator } from '@/components/ui/separator';
import SignOutButton from './SignOutButton';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAVBAR_LINKS } from '@/lib/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/auth';
import NavbarLink from './NavbarLink';

type NavbarButtonProps = {
  user: User;
};

export default function NavbarButton({ user }: NavbarButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAdmin = user.role === 'admin';

  return (
    <>
      {/* MOBILE */}
      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              className='w-10 h-10'
            >
              <Menu className='size-5' />
            </Button>
          </SheetTrigger>
          <SheetContent className='px-4 pt-12 pb-4'>
            <SheetTitle className='hidden'>Menu di navigazione a scomparsa</SheetTitle>
            <nav className='max-h-max overflow-y-auto flex flex-col gap-2'>
              {NAVBAR_LINKS.map((link) => {
                const visible = link.visibleTo.includes(user.role);

                return (
                  visible && (
                    <NavbarLink
                      key={link.label}
                      link={link}
                    />
                  )
                );
              })}

              <Separator />

              {!isAdmin && (
                <Link
                  href='/profilo'
                  prefetch={false}
                  className='flex items-center gap-2 text-sm font-medium rounded-xl p-2 hover:bg-zinc-50'
                >
                  <UserRound className='size-3' />
                  Profilo
                </Link>
              )}

              <ChangePasswordButton
                userId={user.id}
                email={user.email}
              />

              <Separator />

              <Link
                href=''
                prefetch={false}
                className='flex items-center gap-2 text-sm text-blue-600 font-medium rounded-xl p-2 hover:bg-zinc-50'
              >
                <SquareArrowOutUpRight className='size-3' />
                Informativa sulla privacy
              </Link>

              <Link
                href=''
                prefetch={false}
                className='flex items-center gap-2 text-sm text-blue-600 font-medium rounded-xl p-2 hover:bg-zinc-50'
              >
                <SquareArrowOutUpRight className='size-3' />
                Termini e Condizioni
              </Link>

              <Separator />

              <SignOutButton />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP */}
      <div className='hidden md:block'>
        <Popover
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <PopoverTrigger asChild>
            <div className='w-40 flex flex-nowrap justify-between items-center gap-2 bg-zinc-50 hover:bg-white p-2 rounded-2xl hover:cursor-pointer transition-colors'>
              <Avatar className='w-8 h-8'>
                <AvatarFallback className='bg-zinc-200'>
                  {user.name.substring(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className='grow text-sm font-semibold truncate text-zinc-700'>{user.name}</span>

              <ChevronDown
                className={cn('shrink-0 size-4 transition-transform', isOpen ? 'rotate-180' : '')}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className='p-1 rounded-2xl'
            align='end'
          >
            {!isAdmin && (
              <Link
                href='/profilo'
                prefetch={false}
                className='flex items-center gap-2 text-sm font-medium p-2 transition-colors rounded-md hover:bg-zinc-50 hover:cursor-pointer'
              >
                <UserRound className='size-3' />
                Profilo
              </Link>
            )}

            <ChangePasswordButton
              userId={user.id}
              email={user.email}
            />

            <Separator />

            <div className='flex items-center gap-2 text-sm text-blue-700 font-medium p-2 transition-colors rounded-md hover:bg-zinc-50 hover:cursor-pointer'>
              <SquareArrowOutUpRight className='size-3' /> Informativa sulla privacy
            </div>

            <div className='flex items-center gap-2 text-sm text-blue-700 font-medium p-2 transition-colors rounded-md hover:bg-zinc-50 hover:cursor-pointer'>
              <SquareArrowOutUpRight className='size-3' /> Termini e Condizioni
            </div>

            <Separator />

            <SignOutButton />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
