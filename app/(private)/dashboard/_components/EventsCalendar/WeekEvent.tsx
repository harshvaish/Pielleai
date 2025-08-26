'use client';

import EventStatusBadge from '@/app/(private)/_components/badges/EventStatusBadge';
import { CalendarEvent } from '@/lib/types';
import Image from 'next/image';

type WeekEventProps = {
  event: CalendarEvent;
};

export default function WeekEvent({ event }: WeekEventProps) {
  return (
    <div className='space-y-2 p-1'>
      <EventStatusBadge
        size='sm'
        status={event.status}
      />

      {/* venue */}
      <div className='flex items-center gap-1 text-[10px] font-semibold line-clamp-1'>
        <Image
          className='w-3 h-3'
          src='/images/navbar-icons/venues.svg'
          alt='icona locali'
          width={12}
          height={12}
          loading='lazy'
        />
        <span className='text-[10px] font-semibold line-clamp-1'>{event.venue.name}</span>
      </div>

      {/* artist */}
      <div className='flex items-center gap-1 text-[10px] font-semibold line-clamp-1'>
        <Image
          className='w-3 h-3'
          src='/images/navbar-icons/artists.svg'
          alt='icona artisti'
          width={12}
          height={12}
          loading='lazy'
        />
        <span className='text-[10px] font-semibold line-clamp-1'>{event.artist.stageName}</span>
      </div>

      {/* artist manager */}
      {event.artistManager?.id && (
        <div className='flex items-center gap-1 text-[10px] font-semibold line-clamp-1'>
          <Image
            className='w-3 h-3'
            src='/images/navbar-icons/manager-artists.svg'
            alt='icona manager artisti'
            width={12}
            height={12}
            loading='lazy'
          />
          <span className='text-[10px] font-semibold line-clamp-1'>
            {event.artistManager.name} {event.artistManager.surname}
          </span>
        </div>
      )}
    </div>
  );
}
