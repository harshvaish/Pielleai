'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventFormSchema } from '@/lib/validation/eventFormSchema';
import { Check, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { it } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import useSWR from 'swr';
import { checkTimeRanges, cn, fetcher } from '@/lib/utils';
import { ArtistAvailability, TimeRange } from '@/lib/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArtistAvailabilitySelect() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EventFormSchema>();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [newTimeRange, setNewTimeRange] = useState<TimeRange>({
    startTime: '',
    endTime: '',
  });

  const selectedArtistId = watch('artistId');
  const selectedAvailability = watch('availability');

  const searchDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const label = selectedAvailability ? `${selectedAvailability.date} (${selectedAvailability.startTime} - ${selectedAvailability.endTime})` : 'Seleziona data';

  const fetchUrl = selectedArtistId && searchDate ? `/api/artist-availabilities/date?i=${selectedArtistId}&date=${searchDate}` : null;

  const { data, error, isLoading } = useSWR(fetchUrl, fetcher, {
    dedupingInterval: 0, // milliseconds; 0 disables deduplication
    revalidateIfStale: true,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (!data?.availabilities) return;
    setTimeRanges(
      data.availabilities.map((a: ArtistAvailability) => ({
        availabilityId: a.id,
        startTime: format(a.startDate, 'HH:mm'),
        endTime: format(a.endDate, 'HH:mm'),
        status: a.status,
      }))
    );
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Recupero disponibilità artista non riuscito.');
  }, [error]);

  const onNewAvailabilityClickHandler = () => {
    if (!selectedDate) {
      toast.error('Seleziona una data.');
      return;
    }

    const check = checkTimeRanges(searchDate, [...timeRanges, newTimeRange]);

    if (!check.success) {
      toast.error(check.message);
      return;
    }

    setValue('availability', {
      id: undefined,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: newTimeRange.startTime,
      endTime: newTimeRange.endTime,
    });
    setOpen(false);
  };

  const onAvailabilityClickHandler = (timeRange: TimeRange) => {
    if (!selectedDate || !timeRange.availabilityId) {
      toast.error('Disponibilità selezionata non valida.');
      return;
    }

    if (selectedDate < new Date()) {
      toast.error('Disponibilità selezionata scaduta.');
      return;
    }

    setValue('availability', {
      id: timeRange.availabilityId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
    });
    setOpen(false);
  };

  return (
    <>
      <Button
        type='button'
        size='sm'
        variant='outline'
        className={cn('justify-start text-sm font-normal', selectedAvailability ?? 'text-zinc-400', errors.availability && 'border-destructive')}
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
            <DialogDescription className='hidden'>Tramite questo dialog l&apos;utente può scegliere la disponibilità dell&apos;artista.</DialogDescription>
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

            {searchDate ? (
              <div className='w-full flex flex-col overflow-y-auto'>
                <div className='flex justify-between items-center shrink-0'>
                  <div className='font-semibold text-zinc-700'>Orario</div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    disabled={isLoading}
                  >
                    {isFormVisible ? <Minus /> : <Plus />}
                  </Button>
                </div>

                {isFormVisible && (
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
                      className={cn('w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none')}
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
                      className={cn('w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none')}
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
                  {!isLoading && timeRanges.length === 0 && <div className='text-sm text-zinc-500'>Nessuna disponibilità. Aggiungine una per vederla nella lista.</div>}
                  {!isLoading &&
                    timeRanges.length > 0 &&
                    timeRanges.map((timeRange, index) => {
                      const notAvailable = 'status' in timeRange && timeRange.status !== 'available';

                      return (
                        <div
                          key={index}
                          className='h-10 flex gap-2 justify-between items-center bg-zinc-50 px-2 rounded-xl'
                        >
                          <span>
                            {timeRange.startTime}
                            <span className='text-zinc-400 mx-1'>-</span>
                            {timeRange.endTime}
                          </span>
                          {!notAvailable && (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-emerald-600'
                              onClick={() => onAvailabilityClickHandler(timeRange)}
                              disabled={isLoading}
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
              <div className='w-full flex justify-center items-center text-sm text-zinc-500'>Seleziona una data per accedere alle disponibilità.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
