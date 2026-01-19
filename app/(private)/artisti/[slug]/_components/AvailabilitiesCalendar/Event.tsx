import { CalendarAvailability, EventType } from '@/lib/types';
import { format } from 'date-fns';

type EventProps = { event: CalendarAvailability };

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'dj-set': 'DJ set',
  live: 'Live',
  festival: 'Festival',
};

export default function Event({ event }: EventProps) {
  const start = event.start instanceof Date ? format(event.start, 'HH:mm') : '00:00';
  const end = event.end instanceof Date ? format(event.end, 'HH:mm') : '00:00';
  const eventTitle = event.event?.title?.trim();
  const eventLabel = event.event
    ? eventTitle
      ? eventTitle
      : event.event.eventType
        ? EVENT_TYPE_LABELS[event.event.eventType]
        : `Evento #${event.event.id}`
    : null;
  const venueLabel = event.event?.venue.name ?? null;
  const fallbackLabel = event.event ? null : 'Indisponibilita';

  return (
    <div className='max-w-full overflow-hidden'>
      <span className='text-xs font-semibold line-clamp-1 text-ellipsis'>
        {start} - {end}
      </span>
      {eventLabel && (
        <span className='text-[11px] font-medium line-clamp-1 text-ellipsis text-zinc-100'>
          {eventLabel}
        </span>
      )}
      {fallbackLabel && (
        <span className='text-[11px] font-semibold line-clamp-1 text-ellipsis text-zinc-100'>
          {fallbackLabel}
        </span>
      )}
      {venueLabel && (
        <span className='text-[10px] font-medium line-clamp-1 text-ellipsis text-zinc-200'>
          {venueLabel}
        </span>
      )}
    </div>
  );
}
