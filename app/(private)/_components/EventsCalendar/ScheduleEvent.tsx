import { EventProps } from 'react-big-calendar';
import { CalendarEvent } from '@/lib/types';
import { generateEventTitle } from '@/lib/utils/generate-event-title';

export default function ScheduleEvent({ event }: EventProps<CalendarEvent>) {
  const artistLabel =
    event.artist.stageName?.trim() || `${event.artist.name} ${event.artist.surname}`.trim();
  const title =
    event.title?.trim() || generateEventTitle(artistLabel, event.venue.name, event.start, event.end);

  return (
    <div className='schedule-event'>
      <div className='schedule-event-title'>{title}</div>
      <div className='schedule-event-meta'>
        <span>{artistLabel}</span>
        <span className='schedule-event-separator'>•</span>
        <span>{event.venue.name}</span>
      </div>
    </div>
  );
}
