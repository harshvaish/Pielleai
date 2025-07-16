'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArtistSelectData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ArtistsBadge({
  artists,
}: {
  artists: ArtistSelectData[];
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const count = artists.length;

  if (!count) return <div>Nessun artista</div>;

  if (count === 1) {
    const artist = artists[0];

    return <ArtistBadge artist={artist} />;
  }

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <DropdownMenuTrigger className='w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors'>
        <div className='flex -space-x-3'>
          {artists.slice(0, 3).map((artist, index) => {
            return (
              <Avatar
                key={index}
                className='w-5 h-5'
              >
                <AvatarImage src={artist.avatarUrl} />
                <AvatarFallback>
                  {artist.stageName.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
            );
          })}
        </div>
        <span className='text-sm font-semibold text-zinc-700 whitespace-nowrap'>
          {count} Artisti
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'transition-transform',
            isDropdownOpen ? 'rotate-180' : ''
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='flex flex-col gap-2 p-2'>
        {artists.map((artist) => {
          return (
            <ArtistBadge
              key={artist.id}
              artist={artist}
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ArtistBadge({ artist }: { artist: ArtistSelectData }) {
  const isDisabled = artist.status === 'disabled';

  return (
    <Link
      href={`/artisti/${artist.slug}`}
      className='w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors'
    >
      <Avatar className='w-5 h-5'>
        <AvatarImage
          src={artist.avatarUrl}
          className={isDisabled ? 'grayscale' : ''}
        />
        <AvatarFallback>{artist.stageName.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className='max-w-full overflow-hidden'>
        <div
          className={cn(
            'text-xs font-semibold line-clamp-1 text-ellipsis',
            isDisabled ? 'text-zinc-400' : 'text-zinc-700'
          )}
        >
          @{artist.stageName}
        </div>
        <div
          className={cn(
            'text-[10px] font-medium line-clamp-1 text-ellipsis',
            isDisabled ? 'text-zinc-300' : 'text-zinc-500'
          )}
        >
          {artist.name} {artist.surname}
        </div>
      </div>
    </Link>
  );
}
