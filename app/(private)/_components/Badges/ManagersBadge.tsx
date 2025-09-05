'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArtistManagerSelectData, VenueManagerSelectData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ManagersBadgeProps = {
  isAdmin?: boolean;
  managers: ArtistManagerSelectData[] | VenueManagerSelectData[];
  pathSegment: string;
};

export default function ManagersBadge({
  isAdmin = false,
  managers,
  pathSegment,
}: ManagersBadgeProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const count = managers.length;

  if (!count)
    return (
      <div className='w-max flex flex-nowrap items-center gap-2 p-2'>
        <Image
          src='/images/icon-black.svg'
          alt='icona Milano Ovest'
          width={20}
          height={20}
          className='w-5 h-5'
        />
        <span className='text-xs font-semibold'>Milano Ovest</span>
      </div>
    );

  if (count === 1) {
    const manager = managers[0];
    return (
      <ManagerBadge
        isAdmin={isAdmin}
        manager={manager}
        pathSegment={pathSegment}
      />
    );
  }

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <DropdownMenuTrigger className='w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors'>
        <div className='flex -space-x-3'>
          {managers.slice(0, 3).map((manager, index) => {
            return (
              <Avatar
                key={index}
                className='w-5 h-5'
              >
                <AvatarImage src={manager.avatarUrl} />
                <AvatarFallback>{manager.name.substring(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
            );
          })}
        </div>
        <span className='text-xs font-semibold text-zinc-700 whitespace-nowrap'>
          {count} Manager
        </span>
        <ChevronDown
          className={cn('size-4 transition-transform', isDropdownOpen ? 'rotate-180' : '')}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='flex flex-col gap-2 p-2'>
        {managers.map((manager) => {
          return (
            <ManagerBadge
              key={manager.profileId}
              isAdmin={isAdmin}
              manager={manager}
              pathSegment={pathSegment}
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ManagerBadge({
  isAdmin = false,
  manager,
  pathSegment,
}: {
  isAdmin?: boolean;
  manager: ArtistManagerSelectData | VenueManagerSelectData;
  pathSegment: string;
}) {
  const isDisabled = manager.status === 'disabled';

  return (
    <Link
      href={`/${pathSegment}/${manager.id}`}
      className={cn(
        'w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors',
        !isAdmin && 'pointer-events-none hover:cursor-pointer',
      )}
    >
      <Avatar className='w-5 h-5'>
        <AvatarImage
          src={manager.avatarUrl}
          className={isDisabled ? 'grayscale' : ''}
        />
        <AvatarFallback>{manager.name.substring(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className='max-w-full overflow-hidden'>
        <div
          className={cn(
            'text-xs font-semibold truncate',
            isDisabled ? 'text-zinc-400' : 'text-zinc-700',
          )}
        >
          {manager.name} {manager.surname}
        </div>
      </div>
    </Link>
  );
}
