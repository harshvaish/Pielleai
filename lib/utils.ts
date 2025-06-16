import { clsx, type ClassValue } from 'clsx';
import { View } from 'react-big-calendar';
import { twMerge } from 'tailwind-merge';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { it } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildCalendarLabel(date: Date, view: View): string {
  switch (view) {
    case 'day': {
      // Lunedì 01 gennaio 2025
      return format(date, 'eeee d MMMM yyyy', { locale: it });
    }

    case 'week': {
      const start = startOfWeek(date, { weekStartsOn: 1 }); // lun
      const end = endOfWeek(date, { weekStartsOn: 1 }); // dom

      const sameMonth = start.getMonth() === end.getMonth();
      const sameYear = start.getFullYear() === end.getFullYear();

      if (sameMonth) {
        // 01-07 Gennaio 2025
        return `${format(start, 'd', { locale: it })}-${format(
          end,
          'd MMMM yyyy',
          { locale: it }
        )}`.replace(/\b\w/g, (c) => c.toUpperCase());
      }
      // 31 Gennaio - 06 Febbraio 2026
      if (sameYear) {
        return `${format(start, 'd MMMM', { locale: it })} - ${format(
          end,
          'dd MMMM yyyy',
          { locale: it }
        )}`.replace(/\b\w/g, (c) => c.toUpperCase());
      }

      // 31 Dicembre 2025 - 06 Gennaio 2026
      return `${format(start, 'd MMMM yyyy', { locale: it })} - ${format(
        end,
        'dd MMMM yyyy',
        { locale: it }
      )}`.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    case 'month':
    default:
      // Gennaio 2025
      return format(date, 'MMMM yyyy', { locale: it });
  }
}
