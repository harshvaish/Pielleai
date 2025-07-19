import { CalendarAvailability } from '@/lib/types';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';

export default function WeekEvent({ event }: { event: CalendarAvailability }) {
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
      <div className='flex items-center gap-1'>
        <span className='text-sm font-semibold line-clamp-1'>
          {format(event.start || '', 'HH:mm')}
        </span>
        <span className='text-sm font-semibold line-clamp-1'>
          {format(event.end || '', 'HH:mm')}
        </span>
      </div>
    </div>
  );
}
