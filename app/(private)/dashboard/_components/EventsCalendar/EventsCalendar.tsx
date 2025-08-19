'use client';

import { Calendar as BigCalendar, dateFnsLocalizer, View, ToolbarProps as RBCToolbarProps } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/app/(private)/_components/Calendar/calendar-overrides.css';

import { format, getDay, parse, startOfWeek } from 'date-fns';
import { CALENDAR_VIEWS, TIME_ZONE, EVENTS_STATUS, type EventStatus } from '@/lib/constants';
import ShowMore from './ShowMore';
import { useEffect, useMemo, useState } from 'react';
import { ArtistSelectData, CalendarEvent, EventsCalendarFilters, VenueSelectData } from '@/lib/types';
import useSWR from 'swr';
import { calculateRange, fetcher, splitCsv } from '@/lib/utils';
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
import { Toolbar } from './Toolbar';
import { useSearchParams } from 'next/navigation';

const locales = { it };

export const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type EventsCalendarProps = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
};

export default function EventsCalendar({ artists, venues }: EventsCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('week');
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => calculateRange(new Date(), 'week'));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const searchParams = useSearchParams();

  // --- Build filters from URL params (robustly) ---
  const filters: EventsCalendarFilters = useMemo(() => {
    const isEventStatus = (s: string): s is EventStatus => (EVENTS_STATUS as readonly string[]).includes(s);

    const artistIds = splitCsv(searchParams.get('artist'));
    const venueIds = splitCsv(searchParams.get('venue'));
    const status = splitCsv(searchParams.get('status')).filter(isEventStatus);

    return { artistIds, venueIds, status, startDate: null, endDate: null };
  }, [searchParams]);

  // --- Build SWR key including filters so it refetches on change ---
  const startDate = format(range.start, 'yyyy-MM-dd');
  const endDate = format(range.end, 'yyyy-MM-dd');

  const fetchUrl = useMemo(() => {
    const qs = new URLSearchParams(searchParams.toString()); // clone since Readonly
    qs.set('start', startDate);
    qs.set('end', endDate);
    return `/api/calendar-events/range?${qs.toString()}`;
  }, [searchParams, startDate, endDate]);

  const { data, error, isLoading } = useSWR(fetchUrl, fetcher, { keepPreviousData: true });

  const onNavigateHandler = (newDate: Date) => {
    setDate(newDate);
    setRange(calculateRange(newDate, view));
  };

  const onViewHandler = (nextView: View) => {
    setView(nextView);
    setRange(calculateRange(date, nextView));
  };

  const eventPropGetter = ({ status }: CalendarEvent) => ({ className: status });

  useEffect(() => {
    if (!data?.events) return;
    setEvents(
      data.events.map((event: CalendarEvent) => ({
        ...event,
        start: toZonedTime(event.start, TIME_ZONE),
        end: toZonedTime(event.end, TIME_ZONE),
      }))
    );
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
