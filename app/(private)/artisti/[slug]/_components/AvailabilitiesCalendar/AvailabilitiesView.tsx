'use client';

import { useState } from 'react';
import { Calendar, List } from 'lucide-react';
import { View } from 'react-big-calendar';
import { Button } from '@/components/ui/button';
import { calculateRange } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import AvailabilitiesCalendar from './AvailabilitiesCalendar';
import AvailabilitiesTable from './AvailabilitiesTable';
import { UpdateAvailabilitiesButton } from './UpdateAvailabilitiesButton';

type AvailabilitiesViewProps = {
  userRole: UserRole;
};

type ViewMode = 'calendar' | 'table';

export default function AvailabilitiesView({ userRole }: AvailabilitiesViewProps) {
  const [mode, setMode] = useState<ViewMode>('calendar');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('week');
  const [calendarRange, setCalendarRange] = useState<{ start: Date; end: Date }>(() =>
    calculateRange(new Date(), 'week'),
  );

  const handleNavigate = (newDate: Date) => {
    setCalendarDate(newDate);
    setCalendarRange(calculateRange(newDate, view));
  };

  const handleView = (nextView: View) => {
    setView(nextView);
    setCalendarRange(calculateRange(calendarDate, nextView));
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
        <div className='max-w-max flex gap-1 bg-zinc-50 rounded-xl p-1'>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => setMode('calendar')}
            className={`py-1.5 px-3 rounded-lg ${mode === 'calendar' ? 'bg-zinc-100 text-zinc-700' : 'bg-transparent text-zinc-500'}`}
          >
            <Calendar className='h-4 w-4' />
            Calendario
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => setMode('table')}
            className={`py-1.5 px-3 rounded-lg ${mode === 'table' ? 'bg-zinc-100 text-zinc-700' : 'bg-transparent text-zinc-500'}`}
          >
            <List className='h-4 w-4' />
            Tabella
          </Button>
        </div>

        {mode === 'table' && ['admin', 'artist-manager'].includes(userRole) && (
          <UpdateAvailabilitiesButton />
        )}
      </div>

      {mode === 'calendar' ? (
        <AvailabilitiesCalendar
          userRole={userRole}
          calendarDate={calendarDate}
          calendarRange={calendarRange}
          view={view}
          onNavigate={handleNavigate}
          onView={handleView}
        />
      ) : (
        <AvailabilitiesTable calendarRange={calendarRange} />
      )}
    </div>
  );
}
