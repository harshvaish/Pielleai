'use client';

import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/app/(private)/_components/Calendar/calendar-overrides.css';

import { format, getDay, parse, startOfWeek } from 'date-fns';
import { CALENDAR_VIEWS, TIME_ZONE } from '@/lib/constants';
import ShowMore from './ShowMore';
import { useEffect, useState } from 'react';
import { CalendarEvent } from '@/lib/types';
import useSWR from 'swr';
import { calculateRange, fetcher } from '@/lib/utils';
import { toast } from 'sonner';
import { it } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import WeekEvent from './WeekEvent';
import MonthEvent from './MonthEvent';
import { toZonedTime } from 'date-fns-tz';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import MonthHeader from '@/app/(private)/_components/Calendar/MonthHeader';
import WeekHeader from '@/app/(private)/_components/Calendar/WeekHeader';
import EventContent from './EventContent';

const locales = { it };

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function EventsCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('week');
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => calculateRange(new Date(), 'week'));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const startDate = format(range.start, 'yyyy-MM-dd');
  const endDate = format(range.end, 'yyyy-MM-dd');

  const fetchUrl = `/api/calendar-events/range?start=${startDate}&end=${endDate}`;

  const { data, error, isLoading } = useSWR(fetchUrl, fetcher, {
    keepPreviousData: true,
  });

  const onNavigateHandler = (newDate: Date) => {
    setDate(newDate);
    setRange(calculateRange(newDate, view));
  };

  const onViewHandler = (nextView: View) => {
    setView(nextView);
    setRange(calculateRange(date, nextView));
  };

  const eventPropGetter = ({ status }: CalendarEvent) => {
    return {
      className: status,
    };
  };

  useEffect(() => {
    if (!data?.events) return;

    console.dir(data.events, { depth: null });

    setEvents(data.events.map((event: CalendarEvent) => ({ ...event, start: toZonedTime(event.start, TIME_ZONE), end: toZonedTime(event.end, TIME_ZONE) })));
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Recupero eventi calendario non riuscito.');
  }, [error]);

  return (
    <div className='relative'>
      {isLoading && <Skeleton className='absolute inset-0 z-50 opacity-60 rounded-xl' />}
      <BigCalendar
        localizer={localizer}
        culture='it'
        date={date}
        onNavigate={onNavigateHandler}
        onView={onViewHandler}
        view={view}
        views={CALENDAR_VIEWS}
        defaultView='week'
        toolbar={true}
        showAllEvents={false} // if true showMore is not visible
        components={{
          // toolbar: Toolbar,
          day: {
            event: WeekEvent,
          },
          week: {
            header: WeekHeader,
            event: WeekEvent,
          },
          month: {
            header: MonthHeader,
            event: MonthEvent,
          },
          showMore: ShowMore,
        }}
        events={events}
        style={{ minHeight: '600px' }}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(ev) => setSelectedEvent(ev as CalendarEvent)}
      />

      <ConfirmDialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        title={`Evento #${selectedEvent?.id}`}
        description="Consulta i dati principali dell'evento, per vederne tutti i dettagli o per fare modifiche vai alla sezione eventi."
      >
        {selectedEvent && <EventContent event={selectedEvent} />}
      </ConfirmDialog>
    </div>
  );
}
