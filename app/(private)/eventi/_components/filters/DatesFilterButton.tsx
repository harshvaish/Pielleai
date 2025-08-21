'use client';

import { Button } from '@/components/ui/button';
import { EventsTableFilters } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { useState, useCallback, useTransition } from 'react';
import { type DateRange } from 'react-day-picker';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';
import { Calendar as CalendarIcon, Eraser } from 'lucide-react';
import { it } from 'date-fns/locale';
import ResponsivePopover from '@/app/_components/ResponsivePopover';

type DatesFilterButtonProps = {
  filters: EventsTableFilters;
};

export default function DatesFilterButton({ filters }: DatesFilterButtonProps) {
  const sp = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filters.startDate ?? undefined,
    to: filters.endDate ?? undefined,
  });

  const active = Boolean(filters.startDate && filters.endDate);

  const submitHandler = useCallback(() => {
    const params = new URLSearchParams(sp?.toString());

    if (dateRange?.from) {
      const start = formatInTimeZone(dateRange.from, TIME_ZONE, 'yyyy-MM-dd');
      params.set('start', start);
    } else {
      params.delete('start');
    }

    if (dateRange?.to) {
      const end = formatInTimeZone(dateRange.to, TIME_ZONE, 'yyyy-MM-dd');
      params.set('end', end);
    } else {
      params.delete('end');
    }

    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
      setOpen(false);
    });
  }, [dateRange, router, sp]);

  const resetHandler = () => {
    setDateRange(undefined);
  };

  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      title='Filtro date'
      description='Seleziona una data di inizio e una di fine per filtrare.'
      trigger={
        <Button
          variant={active ? 'secondary' : 'outline'}
          size='sm'
          disabled={isPending}
        >
          <CalendarIcon />
          Date
        </Button>
      }
    >
      <div className='flex justify-center items-center'>
        <Calendar
          mode='range'
          locale={it}
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          className='rounded-lg border shadow-sm my-4'
        />
      </div>

      <div className='w-full grid grid-cols-2 gap-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={resetHandler}
        >
          <Eraser />
          Pulisci
        </Button>
        <Button
          size='sm'
          onClick={submitHandler}
          disabled={isPending}
        >
          {isPending ? 'Filtro...' : 'Conferma'}
        </Button>
      </div>
    </ResponsivePopover>
  );
}
