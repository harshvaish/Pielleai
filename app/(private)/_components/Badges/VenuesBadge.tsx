'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { VenueBadgeData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function VenuesBadge({ venues }: { venues: VenueBadgeData[] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const count = venues.length;

  if (!count) return <div>Nessun locale</div>;

  if (count === 1) {
    const venue = venues[0];

    return <VenueBadge venue={venue} />;
  }

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <DropdownMenuTrigger className='w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors'>
        <div className='flex -space-x-3'>
          {venues.slice(0, 3).map((venue, index) => {
            return (
              <Avatar
                key={index}
                className='w-5 h-5'
              >
                <AvatarImage src={venue.avatarUrl} />
                <AvatarFallback>{venue.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
            );
          })}
        </div>
        <span className='text-xs font-semibold text-zinc-700 whitespace-nowrap'>{count} Locali</span>
        <ChevronDown className={cn('size-4 transition-transform', isDropdownOpen ? 'rotate-180' : '')} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='flex flex-col gap-2 p-2'>
        {venues.map((venue) => {
          return (
            <VenueBadge
              key={venue.id}
              venue={venue}
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function VenueBadge({ venue }: { venue: VenueBadgeData }) {
  const isDisabled = venue.status === 'disabled';

  return (
    <Link
      href={`/locali/${venue.slug}`}
      className='w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors'
    >
      <Avatar className='w-5 h-5'>
        <AvatarImage
          src={venue.avatarUrl}
          className={isDisabled ? 'grayscale' : ''}
        />
        <AvatarFallback>{venue.name.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className='max-w-full overflow-hidden'>
        <div className={cn('text-xs font-semibold truncate', isDisabled ? 'text-zinc-400' : 'text-zinc-700')}>{venue.name}</div>
      </div>
    </Link>
  );
}
