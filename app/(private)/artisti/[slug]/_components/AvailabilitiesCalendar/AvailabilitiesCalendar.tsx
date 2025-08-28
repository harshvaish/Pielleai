'use client';

import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-overrides.css';

import { endOfDay, format, getDay, parse, startOfDay, startOfWeek } from 'date-fns';
import { CALENDAR_VIEWS, TIME_ZONE } from '@/lib/constants';
import { Toolbar } from './Toolbar';
import WeekHeader from './WeekHeader';
import MonthHeader from './MonthHeader';
import ShowMore from './ShowMore';
import { useEffect, useState } from 'react';
import { ArtistAvailability, CalendarAvailability } from '@/lib/types';
import useSWR from 'swr';
import { notFound, useParams } from 'next/navigation';
import { calculateRange, fetcher } from '@/lib/utils';
import { toast } from 'sonner';
import { it } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import Event from './Event';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const locales = { it };

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AvailabilitiesCalendar() {
  const { slug } = useParams();
  if (!slug || typeof slug !== 'string') notFound();

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarRange, setCalendarRange] = useState<{ start: Date; end: Date }>(() =>
    calculateRange(new Date(), 'week'),
  );
  const [view, setView] = useState<View>('week');

  const [availabilities, setAvailabilities] = useState<CalendarAvailability[]>([]);

  const startDateUTC = fromZonedTime(
    startOfDay(calendarRange.start), // set to 00:00 in local TZ
    TIME_ZONE, // your app’s locale time zone, e.g. 'Europe/Rome'
  ).toISOString(); // convert to UTC string

  const endDateUTC = fromZonedTime(
    endOfDay(calendarRange.end), // set to 23:59 in local TZ
    TIME_ZONE, // your app’s locale time zone, e.g. 'Europe/Rome'
  ).toISOString(); // convert to UTC string

  const fetchUrl = `/api/artist-availabilities/range?s=${slug}&sd=${startDateUTC}&ed=${endDateUTC}`;

  const { data: response, isLoading } = useSWR(fetchUrl, fetcher);

  const onNavigateHandler = (newDate: Date) => {
    setCalendarDate(newDate);
    setCalendarRange(calculateRange(newDate, view));
  };

  const onViewHandler = (nextView: View) => {
    setView(nextView);
    setCalendarRange(calculateRange(calendarDate, nextView));
  };

  const eventPropGetter = ({ status }: CalendarAvailability) => {
    return {
      className: status ?? 'draft',
    };
  };

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      toast.error(response.message || 'Recupero disponibilità artista non riuscito.');
      return;
    }

    setAvailabilities(
      response.data.map((a: ArtistAvailability) => ({
        ...a,
        startDate: toZonedTime(a.startDate, TIME_ZONE),
        endDate: toZonedTime(a.endDate, TIME_ZONE),
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
        toolbar={true}
        showAllEvents={false} // if true showMore is not visible
        components={{
          toolbar: Toolbar,
          day: {
            event: Event,
          },
          week: {
            header: WeekHeader,
            event: Event,
          },
          month: {
            header: MonthHeader,
            event: Event,
          },
          showMore: ShowMore,
        }}
        events={availabilities}
        style={{ minHeight: '600px' }}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
}
