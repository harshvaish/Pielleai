'use client';

import {
  Calendar,
  dateFnsLocalizer,
  EventPropGetter,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-overrides.css';

import { format, parse, startOfWeek, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { CALENDAR_VIEWS } from '@/lib/constants';
import { Toolbar } from './Toolbar';
import { CalendarEvent } from '@/lib/types';
import WeekEvent from './WeekEvent';
import MonthEvent from './MonthEvent';
import WeekHeader from './WeekHeader';
import MonthHeader from './MonthHeader';
import ShowMore from './ShowMore';

const locales = { it };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function MyCalendar({ events }: { events: CalendarEvent[] }) {
  const eventPropGetter: EventPropGetter<CalendarEvent> = (event) => {
    return {
      className: event.status ?? 'draft',
    };
  };

  return (
    <Calendar
      localizer={localizer}
      culture='it'
      defaultView='week'
      toolbar
      showAllEvents={false}
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
      views={CALENDAR_VIEWS}
      events={events}
      style={{ minHeight: '600px' }}
      eventPropGetter={eventPropGetter}
    />
  );
}
