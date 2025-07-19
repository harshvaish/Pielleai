'use client';

import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  EventPropGetter,
  View,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-overrides.css';

import { format, parse, startOfWeek, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { CALENDAR_VIEWS } from '@/lib/constants';
import { Toolbar } from './Toolbar';
import WeekEvent from './WeekEvent';
import MonthEvent from './MonthEvent';
import WeekHeader from './WeekHeader';
import MonthHeader from './MonthHeader';
import ShowMore from './ShowMore';
import { useEffect, useState } from 'react';
import { ArtistAvailability, CalendarAvailability } from '@/lib/types';
import useSWR from 'swr';
import { notFound, useParams } from 'next/navigation';
import { fetcher } from '@/lib/utils';
import { toast } from 'sonner';

const locales = { it };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AvailabilitiesCalendar() {
  const { slug } = useParams();
  if (!slug && typeof slug != 'string') notFound();

  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState<Date>(new Date());
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);
  const [availabilities, setAvailabilities] = useState<CalendarAvailability[]>(
    []
  );

  const startDate = range?.start ? format(range?.start, 'yyyy-MM-dd') : '';
  const endDate = range?.end ? format(range?.end, 'yyyy-MM-dd') : '';
  const fetchUrl =
    startDate && endDate
      ? `/api/artist-availabilities/range?artist=${slug}&start=${startDate}&end=${endDate}`
      : null;

  const { data, error, isLoading } = useSWR(fetchUrl, fetcher, {
    dedupingInterval: 0, // milliseconds; 0 disables deduplication
    revalidateIfStale: true,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (!data?.availabilities) return;
    setAvailabilities(
      data.availabilities.map((a: ArtistAvailability) => ({
        start: a.startDate,
        end: a.endDate,
        status: a.status,
      }))
    );
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Recupero disponibilità artista non riuscito.');
  }, [error]);

  const onRangeChangeHandler = (range: Date[] | { start: Date; end: Date }) => {
    if (Array.isArray(range)) {
      // Month view returns an array of dates
      setRange({ start: range[0], end: range[range.length - 1] });
    } else {
      // Week, day views return { start, end }
      setRange(range);
    }
  };

  const eventPropGetter: EventPropGetter<CalendarAvailability> = (event) => {
    return {
      className: event.status ?? 'draft',
    };
  };

  return (
    <BigCalendar
      localizer={localizer}
      culture='it'
      date={date}
      onNavigate={setDate}
      onRangeChange={onRangeChangeHandler}
      views={CALENDAR_VIEWS}
      defaultView='week'
      view={view}
      onView={setView}
      toolbar={true}
      showAllEvents={true}
      components={{
        toolbar: Toolbar,
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
      events={availabilities}
      style={{ minHeight: '600px' }}
      eventPropGetter={eventPropGetter}
    />
  );
}
