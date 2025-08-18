'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CALENDAR_VIEWS } from '@/lib/constants';
import { buildCalendarLabel } from '@/lib/utils';
import { ToolbarProps } from 'react-big-calendar';
import { CalendarAvailability } from '@/lib/types';
import { EditAvailabilitiesButton } from './EditAvailabilitiesButton';

export function Toolbar({
  date,
  view,
  onNavigate,
  onView,
}: ToolbarProps<CalendarAvailability, object>) {
  const label = buildCalendarLabel(date, view);

  return (
    <div className='flex flex-col xl:flex-row justify-between items-center gap-4 mb-4'>
      {/* Title & arrows */}
      <div className='w-full xl:w-auto flex justify-center items-center gap-2'>
        <div className='hidden md:block text-2xl font-bold capitalize'>
          {label}
        </div>
        <div className='flex items-center'>
          <Button
            size='icon'
            variant='ghost'
            className='w-6 h-6 text-zinc-400 rounded-xl'
            onClick={() => onNavigate('PREV')}
          >
            <ChevronLeft className='stroke-3' />
          </Button>
          <div className='grow md:hidden font-semibold capitalize text-center'>
            {label}
          </div>
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
      <div className='max-w-max flex gap-1 bg-zinc-50 p-1 rounded-xl'>
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

      <EditAvailabilitiesButton />
    </div>
  );
}
