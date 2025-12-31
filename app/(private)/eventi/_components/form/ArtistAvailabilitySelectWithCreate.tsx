'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EventFormSchema } from '@/lib/validation/event-form-schema';
import { Check, Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { it } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { format, startOfDay } from 'date-fns';
import useSWR from 'swr';
import { checkAvailabilities, cn, fetcher } from '@/lib/utils';
import { ArtistAvailability, TimeRange } from '@/lib/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';
import { z } from 'zod/v4';
import { timeValidation } from '@/lib/validation/_general';

export default function ArtistAvailabilitySelectWithCreate() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EventFormSchema>();

  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [visible, setVisible] = useState<boolean>(false);
  const [newTimeRange, setNewTimeRange] = useState<TimeRange>({
    startTime: '',
    endTime: '',
  });

  const [availabilities, setAvailabilities] = useState<ArtistAvailability[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedArtistId = watch('artistId');
  const selectedAvailability = watch('availability');

  const onNewAvailabilityClickHandler = () => {
    if (!selectedDate) {
      toast.error('Seleziona una data.');
      return;
    }

    setLoading(true);

    const schema = z.object({
      startTime: timeValidation,
      endTime: timeValidation,
    });

    const validation = schema.safeParse({
      startTime: newTimeRange.startTime,
      endTime: newTimeRange.endTime,
    });

    if (!validation.success) {
      toast.error('Orari nuova disponibilità non validi.');
      setLoading(false);
      return;
    }

    const startTimeFragments = newTimeRange.startTime.split(':');
    const endTimeFragments = newTimeRange.endTime.split(':');

    const start = new Date(selectedDate);
    start.setHours(parseInt(startTimeFragments[0], 10), parseInt(startTimeFragments[1], 10), 0, 0);
    const end = new Date(selectedDate);
    end.setHours(parseInt(endTimeFragments[0], 10), parseInt(endTimeFragments[1], 10), 0, 0);

    const startUTC = fromZonedTime(start, TIME_ZONE);
    const endUTC = fromZonedTime(end, TIME_ZONE);

    const newAvailability = {
      startDate: startUTC,
      endDate: endUTC,
    };

    const check = checkAvailabilities([...availabilities, newAvailability]);

    if (!check.success) {
      toast.error(check.message);
      setLoading(false);
      return;
    }

    setValue('availability', {
      id: undefined,
      startDate: startUTC,
      endDate: endUTC,
    });

    setNewTimeRange({ startTime: '', endTime: '' });
    setLoading(false);
    setOpen(false);
  };

  const onAvailabilityClickHandler = (availability: ArtistAvailability) => {
    if (!selectedDate || !availability.id) {
      toast.error('Disponibilità selezionata non valida.');
      return;
    }

    if (selectedDate < new Date()) {
      toast.error('Disponibilità selezionata scaduta.');
      return;
    }

    setValue('availability', {
      id: availability.id,
      startDate: fromZonedTime(availability.startDate, TIME_ZONE),
      endDate: fromZonedTime(availability.endDate, TIME_ZONE),
    });
    setOpen(false);
  };

  const label = useMemo(() => {
    if (!selectedAvailability?.startDate || !selectedAvailability?.endDate) {
      return 'Seleziona data';
    }
    try {
      const start = formatInTimeZone(
        selectedAvailability.startDate,
        TIME_ZONE,
        'dd/MM/yyyy (HH:mm',
      );
      const end = formatInTimeZone(selectedAvailability.endDate, TIME_ZONE, 'HH:mm)');
      return `${start} - ${end}`;
    } catch {
      return 'Seleziona data';
    }
  }, [selectedAvailability]);

  const startDateUTC = useMemo(() => {
    if (!selectedDate) return null;
    const startLocal = startOfDay(selectedDate);
    return fromZonedTime(startLocal, TIME_ZONE).toISOString();
  }, [selectedDate]);

  const fetchUrl = useMemo(() => {
    if (!selectedArtistId || !startDateUTC) return null;
    return `/api/artist-availabilities/date?i=${selectedArtistId}&sd=${startDateUTC}`;
  }, [selectedArtistId, startDateUTC]);

  const { data: response, isLoading } = useSWR(fetchUrl, fetcher);

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      toast.error(response.message || 'Recupero disponibilità artista non riuscito.');
      return;
    }

    setAvailabilities(
      response.data.map((a: ArtistAvailability) => ({
        ...a,
        start: toZonedTime(a.startDate, TIME_ZONE),
        end: toZonedTime(a.endDate, TIME_ZONE),
      })),
    );
  }, [response]);

  return (
    <>
      <Button
        type='button'
        size='sm'
        variant='outline'
        className={cn(
          'justify-start text-sm font-normal',
          selectedAvailability ?? 'text-zinc-400',
          errors.availability && 'border-destructive',
        )}
        onClick={() => setOpen(true)}
        disabled={!selectedArtistId}
      >
        {label}
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className='h-dvh md:max-h-[420px] w-dvw grid grid-rows-[auto_1fr] p-4 pt-12 rounded-none md:rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Seleziona data e ora dell&apos;evento</DialogTitle>
            <DialogDescription className='hidden'>
              Tramite questo dialog l&apos;utente può scegliere la disponibilità dell&apos;artista.
            </DialogDescription>
          </DialogHeader>

          <div className='h-full grid grid-rows-[max-content_1fr] md:grid-rows-none md:grid-cols-2 justify-items-center gap-4 py-4 border-t overflow-hidden'>
            <Calendar
              locale={it}
              mode='single'
              className='h-max p-0 self-center'
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isLoading ? true : { before: new Date() }}
            />

            {selectedDate ? (
              <div className='w-full flex flex-col overflow-y-auto'>
                <div className='flex justify-between items-center shrink-0'>
                  <div className='font-semibold text-zinc-700'>Orario</div>
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
                  <div className='flex gap-2 items-center text-zinc-700 pb-2 border-b'>
                    <Input
                      type='time'
                      value={newTimeRange.startTime}
                      onChange={(e) =>
                        setNewTimeRange((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      className={cn(
                        'w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none',
                      )}
                      disabled={isLoading}
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
                      className={cn(
                        'w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none',
                      )}
                      disabled={isLoading}
                    />

                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-emerald-600'
                      onClick={onNewAvailabilityClickHandler}
                      disabled={isLoading}
                    >
                      <Check />
                    </Button>
                  </div>
                )}

                <div className='flex flex-col gap-2 my-4 overflow-y-auto'>
                  {isLoading && (
                    <>
                      <Skeleton className='h-8 rounded-md' />
                      <Skeleton className='h-8 rounded-md' />
                      <Skeleton className='h-8 rounded-md' />
                    </>
                  )}
                  {!isLoading && availabilities.length === 0 && (
                    <div className='text-sm text-zinc-500'>
                      Nessuna disponibilità. Aggiungine una per vederla nella lista.
                    </div>
                  )}
                  {!isLoading &&
                    availabilities.length > 0 &&
                    availabilities.map((av) => {
                      const notAvailable = 'status' in av && av.status !== 'available';

                      return (
                        <div
                          key={av.id}
                          className='h-10 flex gap-2 justify-between items-center bg-zinc-50 px-2 rounded-xl'
                        >
                          <span>
                            {format(av.startDate, 'HH:mm')}
                            <span className='text-zinc-400 mx-1'>-</span>
                            {format(av.endDate, 'HH:mm')}
                          </span>
                          {!notAvailable && (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-emerald-600'
                              onClick={() => onAvailabilityClickHandler(av)}
                              disabled={loading || isLoading}
                            >
                              <Check />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className='w-full flex justify-center items-center text-sm text-zinc-500'>
                Seleziona una data per accedere alle disponibilità.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
