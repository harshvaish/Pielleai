import { CalendarAvailability } from '@/lib/types';
import { format } from 'date-fns';

export default function MonthEvent({ event }: { event: CalendarAvailability }) {
  const start =
    event.start instanceof Date ? format(event.start, 'HH:mm') : '00:00';
  const end = event.end instanceof Date ? format(event.end, 'HH:mm') : '00:00';

  return (
    <div className='flex items-center gap-1 p-1'>
      {/* time */}
      <span className='text-xs font-medium text-zinc-500'>{start}</span>
      <span className='text-xs font-medium text-zinc-500'>{end}</span>
      <span className='text-xs font-semibold line-clamp-1'>{event.status}</span>
    </div>
  );
}
