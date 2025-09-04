'use client';

import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  View,
  ToolbarProps as RBCToolbarProps,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-overrides.css';
import { endOfDay, format, getDay, parse, startOfDay, startOfWeek } from 'date-fns';
import { CALENDAR_VIEWS, TIME_ZONE } from '@/lib/constants';
import ShowMore from './ShowMore';
import { useEffect, useState } from 'react';
import {
  ArtistSelectData,
  CalendarEvent,
  EventsCalendarFilters,
  EventStatus,
  VenueSelectData,
} from '@/lib/types';
import useSWR from 'swr';
import { calculateRange, fetcher, splitCsv } from '@/lib/utils';
import { toast } from 'sonner';
import { it } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import WeekEvent from './WeekEvent';
import MonthEvent from './MonthEvent';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import MonthHeader from '@/app/(private)/_components/calendar/MonthHeader';
import WeekHeader from '@/app/(private)/_components/calendar/WeekHeader';
import EventContent from './EventContent';
import { Toolbar } from './Toolbar';
import { useSearchParams } from 'next/navigation';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const locales = { it };

export const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type EventsCalendarProps = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
};

export default function EventsCalendar({ artists, venues }: EventsCalendarProps) {
  const searchParams = useSearchParams();

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarRange, setCalendarRange] = useState<{ start: Date; end: Date }>(() =>
    calculateRange(new Date(), 'week'),
  );
  const [view, setView] = useState<View>('week');

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const filters: EventsCalendarFilters = {
    artistIds: splitCsv(searchParams.get('a')),
    venueIds: splitCsv(searchParams.get('v')),
    status: splitCsv(searchParams.get('s')) as EventStatus[],
  };

  const startDateUTC = fromZonedTime(
    startOfDay(calendarRange.start), // set to 00:00 in local TZ
    TIME_ZONE, // your app’s locale time zone, e.g. 'Europe/Rome'
  ).toISOString(); // convert to UTC string

  const endDateUTC = fromZonedTime(
    endOfDay(calendarRange.end), // set to 23:59 in local TZ
    TIME_ZONE, // your app’s locale time zone, e.g. 'Europe/Rome'
  ).toISOString(); // convert to UTC string

  const qs = new URLSearchParams(searchParams.toString());
  qs.set('sd', startDateUTC);
  qs.set('ed', endDateUTC);
  const fetchUrl = `/api/events/calendar/range?${qs.toString()}`;

  const { data: response, isLoading } = useSWR(fetchUrl, fetcher, { keepPreviousData: true });

  const onNavigateHandler = (newDate: Date) => {
    setCalendarDate(newDate);
    setCalendarRange(calculateRange(newDate, view));
  };

  const onViewHandler = (nextView: View) => {
    setView(nextView);
    setCalendarRange(calculateRange(calendarDate, nextView));
  };

  const eventPropGetter = ({ status }: CalendarEvent) => ({ className: status });

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      toast.error(response.message || 'Recupero eventi calendario non riuscito.');
      return;
    }

    setEvents(
      response.data.map((event: CalendarEvent) => ({
        ...event,
        start: toZonedTime(event.start, TIME_ZONE),
        end: toZonedTime(event.end, TIME_ZONE),
      })),
    );
  }, [response]);

  return (
    <div className='relative'>
      {isLoading && <Skeleton className='absolute inset-0 z-50 opacity-60 rounded-xl' />}
      <BigCalendar
        localizer={localizer}
        culture='it'
        date={calendarDate}
        onNavigate={onNavigateHandler}
        onView={onViewHandler}
        view={view}
        views={CALENDAR_VIEWS}
        defaultView='week'
        toolbar
        showAllEvents={false}
        components={{
          toolbar: (props) => (
            <Toolbar
              {...(props as RBCToolbarProps<CalendarEvent, object>)}
              filters={filters}
              artists={artists}
              venues={venues}
            />
          ),
          day: { event: WeekEvent },
          week: { header: WeekHeader, event: WeekEvent },
          month: { header: MonthHeader, event: MonthEvent },
          showMore: ShowMore,
        }}
        events={events}
        style={{ minHeight: '600px' }}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(ev) => {
          setSelectedEvent(ev as CalendarEvent);
          setDialogOpen(true);
        }}
      />

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) window.setTimeout(() => setSelectedEvent(null), 200);
        }}
        title={`Evento #${selectedEvent?.id ?? ''}`}
        description="Consulta i dati principali dell'evento, per vederne tutti i dettagli o per fare modifiche vai alla sezione eventi."
      >
        {selectedEvent && <EventContent event={selectedEvent} />}
      </ConfirmDialog>
    </div>
  );
}
