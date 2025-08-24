'use client';

import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/app/(private)/_components/Calendar/calendar-overrides.css';

import { format, getDay, parse, startOfWeek } from 'date-fns';
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

  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('week');
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => calculateRange(new Date(), 'week'));
  const [availabilities, setAvailabilities] = useState<CalendarAvailability[]>([]);

  const startDateUTC = format(fromZonedTime(range.start, TIME_ZONE), 'yyyy-MM-dd');
  const endDateUTC = format(fromZonedTime(range.end, TIME_ZONE), 'yyyy-MM-dd');

  const fetchUrl = `/api/artist-availabilities/range?artist=${slug}&start=${startDateUTC}&end=${endDateUTC}`;

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

  const eventPropGetter = ({ status }: CalendarAvailability) => {
    return {
      className: status ?? 'draft',
    };
  };

  useEffect(() => {
    if (!data?.availabilities) return;

    setAvailabilities(
      data.availabilities.map((a: ArtistAvailability) => ({
        start: toZonedTime(a.startDate, TIME_ZONE),
        end: toZonedTime(a.endDate, TIME_ZONE),
        status: a.status,
      }))
    );
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Recupero disponibilità artista non riuscito.');
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
