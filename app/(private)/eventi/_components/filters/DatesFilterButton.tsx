'use client';

import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { EventsTableFilters } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState, useCallback } from 'react';
import { type DateRange } from 'react-day-picker';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { it } from 'date-fns/locale';

type DatesFilterButtonProps = {
  filters: EventsTableFilters;
};

export default function DatesFilterButton({ filters }: DatesFilterButtonProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [loading, setLoading] = useState<boolean>(false);
  const sp = useSearchParams();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filters.startDate ?? undefined,
    to: filters.endDate ?? undefined,
  });

  const [openPopover, setOpenPopover] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const active = Boolean(filters.startDate && filters.endDate);

  const applyParams = useCallback(() => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.info('Seleziona una data di inizio e una di fine.');
      return;
    }

    setLoading(true);
    const params = new URLSearchParams(sp?.toString());
    const start = formatInTimeZone(dateRange.from, TIME_ZONE, 'yyyy-MM-dd');
    const end = formatInTimeZone(dateRange.to, TIME_ZONE, 'yyyy-MM-dd');

    params.set('start', start);
    params.set('end', end);
    params.delete('page'); // reset pagination
    router.push(`?${params.toString()}`);
    setOpenPopover(false);
    setOpenDrawer(false);
    setLoading(false);
  }, [dateRange, router, sp]);

  const clearParams = useCallback(() => {
    const params = new URLSearchParams(sp?.toString());
    params.delete('start');
    params.delete('end');
    params.delete('page');
    router.push(`?${params.toString()}`);
    setDateRange(undefined);
    setOpenPopover(false);
    setOpenDrawer(false);
    setLoading(false);
  }, [router, sp]);

  // shared content
  const Content = (
    <>
      <Calendar
        mode='range'
        locale={it}
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        className='rounded-lg border shadow-sm my-4'
      />

      <div className={cn('w-full gap-2', isDesktop ? 'flex justify-end items-center' : 'grid grid-cols-2')}>
        <Button
          variant='secondary'
          size={isDesktop ? 'xs' : 'sm'}
          onClick={clearParams}
          disabled={loading}
        >
          Rimuovi
        </Button>
        <Button
          size={isDesktop ? 'xs' : 'sm'}
          onClick={applyParams}
          disabled={loading}
        >
          Applica
        </Button>
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Popover
        open={openPopover}
        onOpenChange={setOpenPopover}
      >
        <PopoverTrigger asChild>
          <Button
            variant={active ? 'secondary' : 'outline'}
            size='sm'
          >
            <CalendarIcon />
            Date
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end'>
          <div className='text-lg font-semibold'>Filtro date</div>
          <div className='text-sm font-light text-zinc-500'>Seleziona una data di inizio e una di fine.</div>
          {Content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer
      open={openDrawer}
      onOpenChange={setOpenDrawer}
    >
      <DrawerTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'outline'}
          size='sm'
        >
          <CalendarIcon />
          Date
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='flex flex-col items-center p-4'>
          <DrawerTitle className='text-lg font-semibold'>Filtro date</DrawerTitle>
          <DrawerDescription className='text-sm font-light text-zinc-500'>Seleziona una data di inizio e una di fine.</DrawerDescription>

          {Content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
