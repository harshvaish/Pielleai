import { format } from 'date-fns';
import { it } from 'date-fns/locale';

type ScheduleDateProps = {
  day: Date;
  label?: string;
};

export default function ScheduleDate({ day }: ScheduleDateProps) {
  const weekday = format(day, 'EEE', { locale: it }).toUpperCase();
  const month = format(day, 'MMM', { locale: it }).toUpperCase();
  const dayNumber = format(day, 'd', { locale: it });

  return (
    <div className='schedule-date'>
      <div className='schedule-date-weekday'>{weekday}</div>
      <div className='schedule-date-number'>{dayNumber}</div>
      <div className='schedule-date-month'>{month}</div>
    </div>
  );
}
