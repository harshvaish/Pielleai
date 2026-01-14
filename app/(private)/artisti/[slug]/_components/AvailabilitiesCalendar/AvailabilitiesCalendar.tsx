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
import { Toolbar } from './Toolbar';
import WeekHeader from './WeekHeader';
import MonthHeader from './MonthHeader';
import ShowMore from './ShowMore';
import { useEffect, useState } from 'react';
import { ArtistAvailability, CalendarAvailability, UserRole } from '@/lib/types';
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

type AvailabilitiesCalendarProps = {
  userRole: UserRole;
  calendarDate?: Date;
  calendarRange?: { start: Date; end: Date };
  view?: View;
  onNavigate?: (newDate: Date) => void;
  onView?: (nextView: View) => void;
};

export default function AvailabilitiesCalendar({
  userRole,
  calendarDate,
  calendarRange,
  view,
  onNavigate,
  onView,
}: AvailabilitiesCalendarProps) {
  const { slug } = useParams();
  if (!slug || typeof slug !== 'string') notFound();

  const [internalDate, setInternalDate] = useState<Date>(new Date());
  const [internalRange, setInternalRange] = useState<{ start: Date; end: Date }>(() =>
    calculateRange(new Date(), 'week'),
  );
  const [internalView, setInternalView] = useState<View>('week');

  const [availabilities, setAvailabilities] = useState<CalendarAvailability[]>([]);

  const resolvedDate = calendarDate ?? internalDate;
  const resolvedView = view ?? internalView;
  const resolvedRange = calendarRange ?? internalRange;

  const startDateUTC = fromZonedTime(
    startOfDay(resolvedRange.start), // set to 00:00 in local TZ
    TIME_ZONE, // your app’s locale time zone, e.g. 'Europe/Rome'
  ).toISOString(); // convert to UTC string

  const endDateUTC = fromZonedTime(
    endOfDay(resolvedRange.end), // set to 23:59 in local TZ
    TIME_ZONE, // your app’s locale time zone, e.g. 'Europe/Rome'
  ).toISOString(); // convert to UTC string

  const fetchUrl = `/api/artist-availabilities/range?s=${slug}&sd=${startDateUTC}&ed=${endDateUTC}`;

  const { data: response, isLoading } = useSWR(fetchUrl, fetcher);

  const onNavigateHandler = (newDate: Date) => {
    if (onNavigate) {
      onNavigate(newDate);
      return;
    }
    setInternalDate(newDate);
    setInternalRange(calculateRange(newDate, resolvedView));
  };

  const onViewHandler = (nextView: View) => {
    if (onView) {
      onView(nextView);
      return;
    }
    setInternalView(nextView);
    setInternalRange(calculateRange(resolvedDate, nextView));
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
        start: toZonedTime(a.startDate, TIME_ZONE),
        end: toZonedTime(a.endDate, TIME_ZONE),
      })),
    );
  }, [response]);

  return (
    <div className='relative'>
      {isLoading && <Skeleton className='absolute inset-0 z-50 opacity-60 rounded-xl' />}
      <BigCalendar
        localizer={localizer}
        culture='it'
        date={resolvedDate}
        onNavigate={onNavigateHandler}
        onView={onViewHandler}
        view={resolvedView}
        views={CALENDAR_VIEWS}
        defaultView='week'
        toolbar={true}
        showAllEvents={false} // if true showMore is not visible
        components={{
          toolbar: (props) => (
            <Toolbar
              {...(props as RBCToolbarProps<CalendarAvailability, object>)}
              userRole={userRole}
            />
          ),
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
