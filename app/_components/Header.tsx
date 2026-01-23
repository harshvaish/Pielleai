'use client';

import Image from 'next/image';
import NavbarButton from './NavbarButton';
import SearchBar from './SearchBar';
import { User } from '@/lib/auth';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  user: User;
  onToggleNav?: () => void;
  isNavCollapsed?: boolean;
};

export default function Header({ user, onToggleNav, isNavCollapsed }: HeaderProps) {
  return (
    <header className='max-h-max flex justify-between items-center px-4 md:px-8 py-4 gap-4 border-b-1'>
      <div className='flex items-center gap-2'>
        <Image
          className='md:hidden w-10 h-10'
          src='/images/icon-black.svg'
          alt='logo Milano Ovest'
          width={40}
          height={40}
          priority
        />

        <Image
          className='hidden md:block w-44'
          src='/images/logo.svg'
          alt='logo con scritta Milano Ovest'
          width={174}
          height={40}
          priority
        />

        {onToggleNav && (
          <Button
            type='button'
            variant='ghost'
            className='hidden md:inline-flex w-10 h-10'
            onClick={onToggleNav}
            aria-label={isNavCollapsed ? 'Apri menu di navigazione' : 'Comprimi menu di navigazione'}
          >
            {isNavCollapsed ? <PanelLeftOpen className='size-5' /> : <PanelLeftClose className='size-5' />}
          </Button>
        )}
      </div>

      <div className='w-full flex justify-end items-center gap-2'>
        {user.role === 'admin' && <SearchBar />}
        <NavbarButton user={user} />
      </div>
    </header>
  );
}
