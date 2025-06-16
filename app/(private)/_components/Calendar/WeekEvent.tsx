import { CalendarEvent } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function WeekEvent({ event }: { event: CalendarEvent }) {
  return (
    <div className='flex flex-col gap-2 p-1'>
      {/* status */}
      <div className='flex items-center gap-1 text-xs font-bold capitalize'>
        {event.status}{' '}
        <span
          className={`flex justify-center items-center w-3 h-3 bg-${
            event.status || 'draft'
          } rounded-full`}
        >
          <ChevronRight
            width={8}
            height={8}
            className='text-white stroke-3'
          />
        </span>
      </div>
      {/* artist */}
      <div className='flex items-center gap-1'>
        <div className='shrink-0 w-4 h-4 rounded-full bg-gray-400'></div>
        <span className='text-sm font-semibold line-clamp-1'>
          {event.artistName}
        </span>
      </div>
      {/* artist manager */}
      <div className='flex items-center gap-1 text-[10px] font-semibold line-clamp-1'>
        <Image
          className='w-3 h-3'
          src='/images/navbar-icons/manager-artists.svg'
          alt='icona Manager artisti'
          width={12}
          height={12}
          loading='lazy'
        />
        <span className='text-[10px] font-semibold line-clamp-1'>
          {event.artistManagerName}
        </span>
      </div>
      {/* venue */}
      <div className='flex items-center gap-1'>
        <Image
          className='w-3 h-3'
          src='/images/navbar-icons/venues.svg'
          alt='icona Locali'
          width={12}
          height={12}
          loading='lazy'
        />
        <span className='text-[10px] font-semibold line-clamp-1'>
          {event.venueName}
        </span>
      </div>
    </div>
  );
}
