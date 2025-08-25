'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CalendarCheck2, Check, Plus, Trash, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArtistAvailability, TimeRange } from '@/lib/types';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import useSWR from 'swr';
import { updateArtistAvailabilities } from '@/lib/server-actions/artists/update-artist-availabilities';
import { checkTimeRanges, cn, fetcher } from '@/lib/utils';
import { notFound, useParams, useRouter } from 'next/navigation';
import { it } from 'date-fns/locale';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';

export function UpdateAvailabilitiesButton() {
  const { slug } = useParams();
  if (!slug && typeof slug != 'string') notFound();

  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const searchDateUTC = selectedDate ? format(fromZonedTime(selectedDate, TIME_ZONE), 'yyyy-MM-dd') : '';
  const fetchUrl = selectedDate ? `/api/artist-availabilities/date?s=${slug}&date=${searchDateUTC}` : null;

  const { data, error, isLoading } = useSWR(fetchUrl, fetcher);

  useEffect(() => {
    if (!data?.availabilities) return;

    setTimeRanges(
      data.availabilities.map((a: ArtistAvailability) => ({
        startTime: formatInTimeZone(a.startDate, TIME_ZONE, 'HH:mm'),
        endTime: formatInTimeZone(a.endDate, TIME_ZONE, 'HH:mm'),
        status: a.status,
        canDelete: a.canDelete,
      }))
    );
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Recupero disponibilità artista non riuscito.');
  }, [error]);

  const addTimeRange = () => {
    if (!selectedDate) return;

    const check = checkTimeRanges(format(selectedDate, 'yyyy-MM-dd'), timeRanges);
    if (!check.success) {
      toast.error(check.message);
      return;
    }

    setTimeRanges([...timeRanges, { startTime: '', endTime: '' }]);
  };

  const removeTimeRange = (index: number) => {
    setTimeRanges(timeRanges.filter((_, i) => i !== index));
  };

  const onSaveHandler = async () => {
    const check = checkTimeRanges(searchDateUTC, timeRanges);

    if (!check.success) {
      toast.error(check.message);
      return;
    }
    setSubmitting(true);

    const response = await updateArtistAvailabilities(slug as string, searchDateUTC, timeRanges);

    if (!response.success) {
      toast.error(response.message);
      setSubmitting(false);
      return;
    }

    router.refresh();
    setSubmitting(false);
    setOpen(false);
    toast.success('Disponibilità aggiornate!');
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
            <DialogTitle>Seleziona le disponibilità e l&apos;orario dell&apos;artista</DialogTitle>
            <DialogDescription className='hidden'>Tramite questo dialog l&apos;utente può inserire o modificare le disponibilità dell&apos;artista.</DialogDescription>
          </DialogHeader>

          <div className='h-full grid grid-rows-[max-content_1fr] md:grid-rows-none md:grid-cols-2 gap-4 py-4 border-t border-b overflow-hidden'>
            <Calendar
              locale={it}
              mode='single'
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={submitting || isLoading ? true : { before: new Date() }}
              className='h-max p-0 self-center'
            />

            {selectedDate ? (
              <div className='flex flex-col overflow-y-auto'>
                <div className='flex justify-between items-center shrink-0'>
                  <div className='font-semibold text-zinc-700'>Orario</div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={addTimeRange}
                    disabled={submitting || isLoading}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className='flex flex-col gap-2 mt-2 overflow-y-auto'>
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
                      const canDelete = !('canDelete' in timeRange) || timeRange?.canDelete;

                      return (
                        <div
                          key={index}
                          className='flex gap-2 items-center text-zinc-700'
                        >
                          <Input
                            type='time'
                            value={timeRange.startTime}
                            onChange={(e) => {
                              const updated = [...timeRanges];
                              updated[index].startTime = e.target.value;
                              setTimeRanges(updated);
                            }}
                            className={cn(
                              'w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none',
                              !canDelete ? 'text-zinc-400 pointer-events-none' : ''
                            )}
                            disabled={submitting || isLoading}
                            readOnly={!canDelete}
                          />
                          <span className='text-zinc-400'>-</span>
                          <Input
                            type='time'
                            value={timeRange.endTime}
                            onChange={(e) => {
                              const updated = [...timeRanges];
                              updated[index].endTime = e.target.value;
                              setTimeRanges(updated);
                            }}
                            className={cn(
                              'w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none shadow-none',
                              !canDelete ? 'text-zinc-400 pointer-events-none' : ''
                            )}
                            disabled={submitting || isLoading}
                            readOnly={!canDelete}
                          />
                          {canDelete && (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-destructive'
                              onClick={() => removeTimeRange(index)}
                              disabled={submitting || isLoading}
                            >
                              <Trash />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className='flex justify-center items-center text-sm text-zinc-500'>Seleziona una data per accedere alle disponibilità.</div>
            )}
          </div>

          <div className='flex justify-between items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-destructive'
              onClick={() => setOpen(false)}
            >
              <X />
              Annulla
            </Button>
            <Button
              size='sm'
              onClick={onSaveHandler}
              disabled={submitting || isLoading}
            >
              <Check />
              Salva
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
