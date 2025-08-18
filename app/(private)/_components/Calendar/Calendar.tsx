'use client';

import { Calendar as BigCalendar, dateFnsLocalizer, EventPropGetter, View } from 'react-big-calendar';
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
import { useState } from 'react';

const locales = { it };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState<Date>(new Date());

  const eventPropGetter: EventPropGetter<CalendarEvent> = (event) => {
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
      events={events}
      style={{ minHeight: '600px' }}
      eventPropGetter={eventPropGetter}
    />
  );
}
