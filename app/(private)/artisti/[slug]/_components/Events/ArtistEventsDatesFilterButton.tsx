'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Eraser } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { useCallback, useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { endOfDay, startOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { it } from 'date-fns/locale';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { TIME_ZONE } from '@/lib/constants';

type ArtistEventsDatesFilterButtonProps = {
  startDate: Date | null;
  endDate: Date | null;
};

export default function ArtistEventsDatesFilterButton({
  startDate,
  endDate,
}: ArtistEventsDatesFilterButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  const active = Boolean(startDate || endDate);

  const submitHandler = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (dateRange?.from) {
      const start = fromZonedTime(startOfDay(dateRange.from), TIME_ZONE).toISOString();
      params.set('start', start);
    } else {
      params.delete('start');
    }

    if (dateRange?.to) {
      const end = fromZonedTime(endOfDay(dateRange.to), TIME_ZONE).toISOString();
      params.set('end', end);
    } else {
      params.delete('end');
    }

    params.set('page', '1');
    setOpen(false);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [dateRange, pathname, router, searchParams]);

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
          size='xs'
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
          size='xs'
          onClick={resetHandler}
        >
          <Eraser />
          Pulisci
        </Button>
        <Button
          size='xs'
          onClick={submitHandler}
          disabled={isPending}
        >
          {isPending ? 'Filtro...' : 'Conferma'}
        </Button>
      </div>
    </ResponsivePopover>
  );
}
