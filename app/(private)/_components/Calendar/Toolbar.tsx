'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';
import { CALENDAR_VIEWS } from '@/lib/constants';
import { buildCalendarLabel } from '@/lib/utils';
import { ToolbarProps } from 'react-big-calendar';
import { CalendarEvent } from '@/lib/types';

export function Toolbar({
  date,
  view,
  onNavigate,
  onView,
}: ToolbarProps<CalendarEvent, object>) {
  const label = buildCalendarLabel(date, view);

  return (
    <div className='flex items-center justify-between mb-4'>
      {/* Title & arrows */}
      <div className='flex items-center gap-2'>
        <div className='text-2xl font-bold capitalize'>{label}</div>
        <div>
          <Button
            size='icon'
            variant='ghost'
            className='w-6 h-6 text-zinc-400 rounded-xl'
            onClick={() => onNavigate('PREV')}
          >
            <ChevronLeft className='stroke-3' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='w-6 h-6 text-zinc-400 rounded-xl'
            onClick={() => onNavigate('NEXT')}
          >
            <ChevronRight className='stroke-3' />
          </Button>
        </div>
      </div>

      {/* view switch */}
      <div className='flex gap-1 bg-zinc-50 p-1 rounded-xl'>
        {CALENDAR_VIEWS.map((v) => (
          <Button
            key={v}
            size='sm'
            variant='ghost'
            onClick={() => onView(v)}
            className={`py-1.5 px-3 rounded-lg ${
              view === v
                ? 'bg-zinc-100 text-zinc-800'
                : 'bg-transparent text-zinc-600'
            }`}
          >
            {v === 'day' ? 'Giorno' : v === 'week' ? 'Settimana' : 'Mese'}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <Button
        size='sm'
        variant='ghost'
        className='gap-2 bg-transparent py-1.5 px-3 rounded-lg border'
      >
        <ListFilter className='h-4 w-4' />
        Filtri
      </Button>
    </div>
  );
}
