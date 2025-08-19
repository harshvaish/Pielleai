'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CALENDAR_VIEWS } from '@/lib/constants';
import { buildCalendarLabel } from '@/lib/utils';
import { ToolbarProps as RbcToolbarProps } from 'react-big-calendar';
import { ArtistSelectData, CalendarEvent, EventsCalendarFilters, VenueSelectData } from '@/lib/types';
import { FiltersButton } from './FiltersButton';

type ToolbarProps = RbcToolbarProps<CalendarEvent, object> & {
  filters: EventsCalendarFilters;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
};

export function Toolbar({ date, view, onNavigate, onView, filters, artists, venues }: ToolbarProps) {
  const label = buildCalendarLabel(date, view);

  return (
    <div className='flex flex-col lg:flex-row justify-between xl:items-center gap-4 mb-8'>
      {/* Title & arrows */}
      <div className='w-full grid grid-cols-[1fr_max-content] items-center gap-2'>
        <div className='text-lg md:text-2xl font-bold capitalize truncate'>{label}</div>

        <div className='flex items-center'>
          <Button
            size='icon'
            variant='ghost'
            className='w-8 h-8 text-zinc-500 rounded-md'
            onClick={() => onNavigate('PREV')}
          >
            <ChevronLeft className='size-4 stroke-3' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='w-8 h-8 text-zinc-500 rounded-md'
            onClick={() => onNavigate('NEXT')}
          >
            <ChevronRight className='size-4 stroke-3' />
          </Button>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row justify-end items-end gap-4'>
        {/* view switch */}
        <div className='max-w-max flex gap-1 bg-zinc-50 rounded-xl'>
          {CALENDAR_VIEWS.map((v) => (
            <Button
              key={v}
              size='sm'
              variant='ghost'
              onClick={() => onView(v)}
              className={`py-1.5 px-3 rounded-lg ${view === v ? 'bg-zinc-100 text-zinc-700' : 'bg-transparent text-zinc-500'}`}
            >
              {v === 'day' ? 'Giorno' : v === 'week' ? 'Settimana' : 'Mese'}
            </Button>
          ))}
        </div>

        {/* filters button */}
        <FiltersButton
          filters={filters}
          artists={artists}
          venues={venues}
        />
      </div>
    </div>
  );
}
