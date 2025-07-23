'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarCheck2, Check, Plus, Trash, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArtistAvailability, TimeRange } from '@/lib/types';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import useSWR from 'swr';
import { editArtistAvailabilities } from '@/lib/server-actions/artists/edit-artist-availabilities';
import { checkTimeRanges, cn, fetcher } from '@/lib/utils';
import { notFound, useParams, useRouter } from 'next/navigation';
import { it } from 'date-fns/locale';

export function EditAvailabilitiesButton() {
  const { slug } = useParams();
  if (!slug && typeof slug != 'string') notFound();

  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const searchDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const fetchUrl = searchDate
    ? `/api/artist-availabilities/date?artist=${slug}&date=${searchDate}`
    : null;

  const { data, error, isLoading } = useSWR(fetchUrl, fetcher, {
    dedupingInterval: 0, // milliseconds; 0 disables deduplication
    revalidateIfStale: true,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (!data?.availabilities) return;
    setTimeRanges(
      data.availabilities.map((a: ArtistAvailability) => ({
        startTime: format(a.startDate, 'HH:mm'),
        endTime: format(a.endDate, 'HH:mm'),
        status: a.status,
      }))
    );
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Recupero disponibilità artista non riuscito.');
  }, [error]);

  const addTimeRange = () => {
    const check = checkTimeRanges(searchDate, timeRanges);
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
    const check = checkTimeRanges(searchDate, timeRanges);
    if (!check.success) {
      toast.error(check.message);
      return;
    }
    setIsSubmitting(true);

    const response = await editArtistAvailabilities({
      artistSlug: slug as string,
      date: searchDate,
      timeRanges,
    });

    if (!response.success) {
      toast(response.message);
      return;
    }

    router.refresh();
    setIsSubmitting(false);
    setIsDialogOpen(false);
    toast.success('Disponibilità aggiornate!');
  };

  return (
    <>
      {/* add availability */}
      <Button
        size='sm'
        variant='ghost'
        className='gap-2 bg-transparent text-zinc-500 py-1.5 px-3 rounded-lg border'
        onClick={() => setIsDialogOpen(true)}
      >
        <CalendarCheck2 className='h-4 w-4' />
        Modifica disponibilità
      </Button>

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              Seleziona le disponibilità e l&apos;orario dell&apos;artista
            </DialogTitle>
            <DialogDescription className='hidden'>
              Tramite questo dialog l&apos;utente può inserire o modificare le
              disponibilità dell&apos;artista.
            </DialogDescription>
          </DialogHeader>
          <Separator />

          <div className='grid grid-cols-2 gap-4'>
            <Calendar
              locale={it}
              mode='single'
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isSubmitting || isLoading}
            />

            {searchDate ? (
              <div className='grid grid-rows-[auto_1fr] gap-2'>
                <div className='flex justify-between items-center'>
                  <div className='font-semibold text-zinc-700'>Orario</div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={addTimeRange}
                    disabled={isSubmitting || isLoading}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className='max-h-[240px] overflow-y-auto'>
                  {isLoading && (
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-8 rounded-md' />
                      <Skeleton className='h-8 rounded-md' />
                      <Skeleton className='h-8 rounded-md' />
                    </div>
                  )}
                  {!isLoading && timeRanges.length === 0 && (
                    <div className='text-sm text-zinc-500'>
                      Nessuna disponibilità. Aggiungine una per vederla nella
                      lista.
                    </div>
                  )}
                  {!isLoading &&
                    timeRanges.length > 0 &&
                    timeRanges.map((timeRange, index) => {
                      const notAvailable =
                        'status' in timeRange &&
                        timeRange.status !== 'available';

                      return (
                        <div
                          key={index}
                          className='flex gap-2 items-center text-zinc-700 mb-2'
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
                              notAvailable
                                ? 'text-zinc-400 pointer-events-none'
                                : ''
                            )}
                            disabled={isSubmitting || isLoading}
                            readOnly={notAvailable}
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
                              notAvailable
                                ? 'text-zinc-400 pointer-events-none'
                                : ''
                            )}
                            disabled={isSubmitting || isLoading}
                            readOnly={notAvailable}
                          />
                          {!notAvailable && (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-destructive'
                              onClick={() => removeTimeRange(index)}
                              disabled={isSubmitting || isLoading}
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
              <div className='flex justify-center items-center text-sm text-zinc-500'>
                Seleziona una data per accedere alle disponibilità.
              </div>
            )}
          </div>

          <Separator />
          <div className='flex justify-between items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-destructive'
              onClick={() => setIsDialogOpen(false)}
            >
              <X />
              Annulla
            </Button>
            <Button
              size='sm'
              onClick={onSaveHandler}
              disabled={isSubmitting || isLoading}
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
