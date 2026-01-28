import { differenceInCalendarDays, format, isSameDay } from 'date-fns';

import { CalendarEvent } from '@/lib/types';

type ScheduleTimeProps = {
  label?: string;
  event?: CalendarEvent;
  day?: Date;
};

export default function ScheduleTime({ label, event, day }: ScheduleTimeProps) {
  if (!label) {
    return <span className='schedule-time'>All day</span>;
  }

  let cleanedLabel = label.replace(/[«»<>]/g, '').trim();
  if (!cleanedLabel) {
    cleanedLabel = 'All day';
  }
  if (cleanedLabel.toLowerCase() === 'all day') {
    cleanedLabel = 'All day';
  }

  if (event && day) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const totalDays = differenceInCalendarDays(end, start) + 1;
    if (totalDays > 1) {
      const dayIndex = differenceInCalendarDays(day, start) + 1;
      (event as CalendarEvent & { __agendaDayIndex?: number }).__agendaDayIndex = dayIndex;
      (event as CalendarEvent & { __agendaTotalDays?: number }).__agendaTotalDays = totalDays;
    }

    if (!isSameDay(start, end)) {
      if (isSameDay(day, start)) {
        cleanedLabel = format(start, 'HH:mm');
      } else if (isSameDay(day, end)) {
        cleanedLabel = format(end, 'HH:mm');
      } else {
        cleanedLabel = 'All day';
      }
    }
  }

  return <span className='schedule-time'>{cleanedLabel}</span>;
}
