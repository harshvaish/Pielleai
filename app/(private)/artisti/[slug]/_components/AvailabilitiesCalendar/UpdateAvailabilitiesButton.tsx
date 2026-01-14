'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CalendarCheck2, Minus, Plus, Trash } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArtistAvailability, EventType, TimeRange } from '@/lib/types';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { addDays, endOfMonth, endOfDay, format, isBefore, startOfDay, startOfMonth } from 'date-fns';
import useSWR from 'swr';
import { checkAvailabilities, cn, fetcher } from '@/lib/utils';
import { notFound, useParams } from 'next/navigation';
import { it } from 'date-fns/locale';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';
import { createArtistAvailability } from '@/lib/server-actions/artists/create-artist-availability';
import { deleteArtistAvailability } from '@/lib/server-actions/artists/delete-artist-availability';
import { z } from 'zod/v4';
import { timeValidation } from '@/lib/validation/_general';
import { Checkbox } from '@/components/ui/checkbox';
import { type DateRange } from 'react-day-picker';

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'dj-set': 'DJ set',
  live: 'Live',
  festival: 'Festival',
};

export function UpdateAvailabilitiesButton() {
  const { slug } = useParams();
  if (!slug && typeof slug != 'string') notFound();

  const [open, setOpen] = useState<boolean>(false);
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isAllDay, setIsAllDay] = useState<boolean>(true);

  const [visible, setVisible] = useState<boolean>(false);
  const [newTimeRange, setNewTimeRange] = useState<TimeRange>({
    startTime: '',
    endTime: '',
  });

  const [availabilities, setAvailabilities] = useState<ArtistAvailability[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const startDateUTC = useMemo(() => {
    if (!selectedDate) return null;
    const startLocal = startOfDay(selectedDate);
    return fromZonedTime(startLocal, TIME_ZONE).toISOString();
  }, [selectedDate]);

  const fetchUrl = useMemo(() => {
    if (!startDateUTC) return null;
    return `/api/artist-availabilities/date?s=${slug}&sd=${startDateUTC}`;
  }, [slug, startDateUTC]);

  const { data: response, isLoading, mutate } = useSWR(fetchUrl, fetcher);

  const monthRange = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    return {
      start: fromZonedTime(startOfDay(monthStart), TIME_ZONE).toISOString(),
      end: fromZonedTime(endOfDay(monthEnd), TIME_ZONE).toISOString(),
    };
  }, [month]);

  const rangeFetchUrl = useMemo(() => {
    return `/api/artist-availabilities/range?s=${slug}&sd=${monthRange.start}&ed=${monthRange.end}`;
  }, [slug, monthRange]);

  const { data: rangeResponse, isLoading: isRangeLoading } = useSWR(rangeFetchUrl, fetcher);

  const unavailableDays = useMemo(() => {
    if (!rangeResponse?.success) return [];
    const seen = new Set<string>();
    const days: Date[] = [];

    (rangeResponse.data as ArtistAvailability[]).forEach((block) => {
      const startLocal = toZonedTime(block.startDate, TIME_ZONE);
      const endLocal = toZonedTime(block.endDate, TIME_ZONE);
      let cursor = startOfDay(startLocal);

      while (cursor < endLocal) {
        const key = format(cursor, 'yyyy-MM-dd');
        if (!seen.has(key)) {
          seen.add(key);
          days.push(cursor);
        }
        cursor = addDays(cursor, 1);
      }
    });

    return days;
  }, [rangeResponse]);

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      toast.error(response.message || 'Recupero disponibilità artista non riuscito.');
      return;
    }

    setAvailabilities(
      response.data.map((a: ArtistAvailability) => ({
        ...a,
        startDate: toZonedTime(a.startDate, TIME_ZONE),
        endDate: toZonedTime(a.endDate, TIME_ZONE),
      })),
    );
  }, [response]);

  const addNewAvailability = async () => {
    if (!selectedDate) return;
    setLoading(true);

    const endDateValue = endDate ?? selectedDate;

    if (isBefore(endDateValue, selectedDate)) {
      toast.error('La data di fine deve essere successiva o uguale alla data di inizio.');
      setLoading(false);
      return;
    }

    let startLocal = new Date(selectedDate);
    let endLocal = new Date(endDateValue);

    if (isAllDay) {
      startLocal = startOfDay(selectedDate);
      endLocal = startOfDay(addDays(endDateValue, 1));
    } else {
      const schema = z.object({
        startTime: timeValidation,
        endTime: timeValidation,
      });

      const validation = schema.safeParse({
        startTime: newTimeRange.startTime,
        endTime: newTimeRange.endTime,
      });

      if (!validation.success) {
        toast.error('Orari nuova indisponibilità non validi.');
        setLoading(false);
        return;
      }

      const startTimeFragments = newTimeRange.startTime.split(':');
      const endTimeFragments = newTimeRange.endTime.split(':');

      startLocal.setHours(
        parseInt(startTimeFragments[0], 10),
        parseInt(startTimeFragments[1], 10),
        0,
        0,
      );
      endLocal.setHours(
        parseInt(endTimeFragments[0], 10),
        parseInt(endTimeFragments[1], 10),
        0,
        0,
      );
    }

    const newAvailability = {
      startDate: fromZonedTime(startLocal, TIME_ZONE),
      endDate: fromZonedTime(endLocal, TIME_ZONE),
    };

    const check = checkAvailabilities([...availabilities, newAvailability]);

    if (!check.success) {
      toast.error(check.message);
      setLoading(false);
      return;
    }

    const response = await createArtistAvailability(slug as string, newAvailability);

    if (!response.success) {
      toast.error(response.message);
      setLoading(false);
      return;
    }

    await mutate();

    setNewTimeRange({ startTime: '', endTime: '' });
    setEndDate(undefined);
    setDateRange(selectedDate ? { from: selectedDate, to: selectedDate } : undefined);
    setIsAllDay(true);
    setLoading(false);
    toast.success('Indisponibilità aggiunta!');
  };

  const removeAvailability = async (id: number) => {
    setLoading(true);

    const response = await deleteArtistAvailability(id);

    if (!response.success) {
      toast.error(response.message);
      setLoading(false);
      return;
    }

    await mutate();

    setLoading(false);
    toast.success('Disponibilità rimossa!');
  };

  return (
    <>
      {/* add availability */}
      <Button
        size='sm'
        variant='ghost'
        className='gap-2 bg-transparent text-zinc-500 py-1.5 px-3 rounded-lg border'
        onClick={() => setOpen(true)}
      >
        <CalendarCheck2 className='h-4 w-4' />
        Modifica
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className='h-dvh w-dvw md:max-h-[460px] grid grid-rows-[max-content_1fr_max-content] rounded-none md:rounded-2xl gap-2 md:gap-4'>
          <DialogHeader>
            <DialogTitle>Seleziona le indisponibilità dell&apos;artista</DialogTitle>
            <DialogDescription className='hidden'>
              Tramite questo dialog l&apos;utente può inserire o modificare le indisponibilità
              dell&apos;artista.
            </DialogDescription>
          </DialogHeader>

          <div className='h-full grid grid-rows-[max-content_1fr] md:grid-rows-none md:grid-cols-2 gap-4 py-4 border-t border-b overflow-hidden'>
            <Calendar
              locale={it}
              mode='range'
              month={month}
              onMonthChange={setMonth}
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                setSelectedDate(range?.from);
                setEndDate(range?.to ?? range?.from);
                if (range?.from) setMonth(range.from);
              }}
              modifiers={{ unavailability: unavailableDays }}
              modifiersClassNames={{ unavailability: 'bg-rose-100 text-rose-700' }}
              disabled={loading || isLoading || isRangeLoading ? true : { before: new Date() }}
              className='h-max p-0 self-center'
            />

            {selectedDate ? (
              <div className='flex flex-col overflow-y-auto'>
                <div className='flex justify-between items-center shrink-0'>
                  <div className='font-semibold text-zinc-700'>Blocco</div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setVisible(!visible)}
                    disabled={isLoading}
                  >
                    {visible ? <Minus /> : <Plus />}
                  </Button>
                </div>

                {visible && (
                  <div className='flex flex-col gap-3 text-zinc-700 pb-2 border-b'>
                    <label className='flex items-center gap-2 text-sm font-medium'>
                      <Checkbox
                        checked={isAllDay}
                        onCheckedChange={(checked) => setIsAllDay(checked === true)}
                      />
                      Giornata intera
                    </label>

                    <div className='flex flex-col gap-2'>
                      <span className='text-xs text-zinc-400 font-medium'>Data inizio</span>
                      <Input
                        type='date'
                        value={selectedDate instanceof Date ? format(selectedDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          if (!e.target.value) {
                            setSelectedDate(undefined);
                            setDateRange(undefined);
                            return;
                          }
                          const nextStart = new Date(`${e.target.value}T00:00:00`);
                          const nextEnd = endDate && isBefore(endDate, nextStart) ? nextStart : endDate;
                          setSelectedDate(nextStart);
                          setEndDate(nextEnd);
                          setDateRange({ from: nextStart, to: nextEnd ?? nextStart });
                        }}
                        className='w-full shadow-none'
                        disabled={isLoading}
                      />
                    </div>

                    <div className='flex flex-col gap-2'>
                      <span className='text-xs text-zinc-400 font-medium'>Data fine</span>
                      <Input
                        type='date'
                        value={endDate instanceof Date ? format(endDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          if (!e.target.value) {
                            setEndDate(undefined);
                            return;
                          }
                          const nextEnd = new Date(`${e.target.value}T00:00:00`);
                          const nextStart =
                            selectedDate && isBefore(nextEnd, selectedDate) ? nextEnd : selectedDate;
                          setSelectedDate(nextStart);
                          setEndDate(nextEnd);
                          setDateRange({ from: nextStart ?? nextEnd, to: nextEnd });
                        }}
                        className='w-full shadow-none'
                        disabled={isLoading}
                      />
                    </div>

                    <div className='flex gap-2 items-center'>
                      <Input
                        type='time'
                        value={newTimeRange.startTime}
                        onChange={(e) =>
                          setNewTimeRange((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        onFocus={() => setIsAllDay(false)}
                        className={cn(
                          'w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none',
                        )}
                        disabled={isLoading || isAllDay}
                      />
                      <span className='text-zinc-400'>-</span>
                      <Input
                        type='time'
                        value={newTimeRange.endTime}
                        onChange={(e) =>
                          setNewTimeRange((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        onFocus={() => setIsAllDay(false)}
                        className={cn(
                          'w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none',
                        )}
                        disabled={isLoading || isAllDay}
                      />
                    </div>

                    <Button
                      size='sm'
                      onClick={addNewAvailability}
                      disabled={isLoading}
                    >
                      Aggiungi
                    </Button>
                  </div>
                )}

                <div className='flex flex-col gap-2 mt-2 overflow-y-auto'>
                  {isLoading && (
                    <>
                      <Skeleton className='h-8 rounded-md' />
                      <Skeleton className='h-8 rounded-md' />
                      <Skeleton className='h-8 rounded-md' />
                    </>
                  )}
                  {!isLoading && availabilities.length === 0 && (
                    <div className='text-sm text-zinc-500'>
                      Nessuna indisponibilità. Aggiungine una per vederla nella lista.
                    </div>
                  )}
                  {!isLoading &&
                    availabilities.length > 0 &&
                    availabilities.map((av) => {
                      const canDelete = !('canDelete' in av) || av?.canDelete;
                      const eventTitle = av.event?.title?.trim();
                      const eventLabel = av.event
                        ? eventTitle
                          ? eventTitle
                          : av.event.eventType
                            ? EVENT_TYPE_LABELS[av.event.eventType]
                            : `Evento #${av.event.id}`
                        : 'Indisponibilita';
                      const venueLabel = av.event?.venue.name ?? null;

                      return (
                        <div
                          key={av.id}
                          className='min-h-10 flex gap-2 justify-between items-center bg-zinc-50 px-2 py-2 rounded-xl'
                        >
                          <div className='flex flex-col'>
                            <span>
                              {format(av.startDate, 'dd/MM/yyyy, HH:mm')}
                              <span className='text-zinc-400 mx-1'>-</span>
                              {format(av.endDate, 'dd/MM/yyyy, HH:mm')}
                            </span>
                            <span className='text-xs text-zinc-500'>
                              {eventLabel}
                              {venueLabel ? ` • ${venueLabel}` : ''}
                            </span>
                          </div>
                          {canDelete ? (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-destructive'
                              onClick={() => removeAvailability(av.id)}
                              disabled={loading || isLoading}
                            >
                              <Trash />
                            </Button>
                          ) : (
                            <span className='text-xs font-medium text-zinc-400'>Bloccato</span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className='flex justify-center items-center text-sm text-zinc-500'>
                Seleziona una data per accedere alle disponibilità.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
