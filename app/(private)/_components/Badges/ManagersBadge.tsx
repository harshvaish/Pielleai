'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AVATAR_FALLBACK } from '@/lib/constants';
import { ArtistManagerSelectData, UserRole, VenueManagerSelectData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ManagersBadgeProps = {
  userRole: UserRole;
  managers: ArtistManagerSelectData[] | VenueManagerSelectData[];
  pathSegment: string;
};

export default function ManagersBadge({ userRole, managers, pathSegment }: ManagersBadgeProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const count = managers.length;

  if (!count) return <ManagerBadgeFallback />;

  if (count === 1) {
    const manager = managers[0];
    return (
      <ManagerBadge
        userRole={userRole}
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
                <AvatarImage src={manager.avatarUrl || AVATAR_FALLBACK} />
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
              userRole={userRole}
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
  userRole,
  manager,
  pathSegment,
}: {
  userRole: UserRole;
  manager: ArtistManagerSelectData | VenueManagerSelectData;
  pathSegment: string;
}) {
  const isAdmin = userRole === 'admin';
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
          src={manager.avatarUrl || AVATAR_FALLBACK}
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

export function ManagerBadgeFallback() {
  return (
    <div className='w-max flex flex-nowrap items-center gap-2 p-2'>
      <Image
        src={AVATAR_FALLBACK}
        alt='icona Milano Ovest'
        width={20}
        height={20}
        className='w-5 h-5'
      />
      <span className='text-xs font-semibold'>Milano Ovest</span>
    </div>
  );
}
