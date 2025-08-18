import { CalendarEvent } from '@/lib/types';
import { format } from 'date-fns';

export default function MonthEvent({ event }: { event: CalendarEvent }) {
  const timeLabel = format(event.start, 'HH:mm');

  return (
    <div className='flex items-center gap-1 p-1'>
      {/* time */}
      <span className='text-xs font-medium text-zinc-500'>{timeLabel}</span>
      {/* artist */}
      <span className='text-xs font-semibold truncate'>{event.artist.stageName}</span>
    </div>
  );
}
