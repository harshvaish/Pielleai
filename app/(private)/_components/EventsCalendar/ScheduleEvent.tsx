import { CalendarEvent } from '@/lib/types';
import { format } from 'date-fns';

type ScheduleEventProps = {
  event?: CalendarEvent;
};

export default function ScheduleEvent({ event }: ScheduleEventProps) {
  if (!event) return null;
  const artistLabel =
    event.artist.stageName?.trim() || `${event.artist.name} ${event.artist.surname}`.trim();
  const startLabel = format(event.start, 'dd/MM/yyyy');
  const endLabel = format(event.end, 'dd/MM/yyyy');
  const baseTitle = `${artistLabel} x ${event.venue.name} - ${startLabel} - ${endLabel}`;
  const totalDays = (event as CalendarEvent & { __agendaTotalDays?: number }).__agendaTotalDays;
  const dayIndex = (event as CalendarEvent & { __agendaDayIndex?: number }).__agendaDayIndex;
  const suffix = totalDays && dayIndex ? ` (Day ${dayIndex}/${totalDays})` : '';
  const title = `${baseTitle}${suffix}`;

  return (
    <div className='schedule-event'>
      <div className='schedule-event-click'>
        <div className='schedule-event-title'>{title}</div>
      </div>
    </div>
  );
}
