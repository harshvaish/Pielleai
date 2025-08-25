'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CalendarCheck2, Minus, Plus, Trash } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArtistAvailability, TimeRange } from '@/lib/types';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { format, startOfDay } from 'date-fns';
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

export function UpdateAvailabilitiesButton() {
  const { slug } = useParams();
  if (!slug && typeof slug != 'string') notFound();

  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [visible, setVisible] = useState<boolean>(false);
  const [newTimeRange, setNewTimeRange] = useState<TimeRange>({
    startTime: '',
    endTime: '',
  });

  const [availabilities, setAvailabilities] = useState<ArtistAvailability[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const startDateUTC = selectedDate
    ? fromZonedTime(
        startOfDay(selectedDate), // set to 00:00 in local TZ
        TIME_ZONE // your app’s locale time zone, e.g. 'Europe/Rome'
      ).toISOString() // convert to UTC string
    : null;

  const fetchUrl = startDateUTC ? `/api/artist-availabilities/date?s=${slug}&sd=${startDateUTC}` : null;

  const { data, error, isLoading, mutate } = useSWR(fetchUrl, fetcher);

  useEffect(() => {
    if (!data?.availabilities) return;

    setAvailabilities(
      data.availabilities.map((a: ArtistAvailability) => ({
        ...a,
        startDate: toZonedTime(a.startDate, TIME_ZONE),
        endDate: toZonedTime(a.endDate, TIME_ZONE),
      }))
    );
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Recupero disponibilità artista non riuscito.');
  }, [error]);

  const addNewAvailability = async () => {
    if (!selectedDate) return;
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

    const startTime = newTimeRange.startTime.split(':');
    const endTime = newTimeRange.endTime.split(':');

    const newAvailability = {
      startDate: fromZonedTime(selectedDate.setHours(parseInt(startTime[0]), parseInt(startTime[1])), TIME_ZONE),
      endDate: fromZonedTime(selectedDate.setHours(parseInt(endTime[0]), parseInt(endTime[1])), TIME_ZONE),
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
    setLoading(false);
    toast.success('Disponibilità aggiunta!');
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
            <DialogTitle>Seleziona le disponibilità e l&apos;orario dell&apos;artista</DialogTitle>
            <DialogDescription className='hidden'>Tramite questo dialog l&apos;utente può inserire o modificare le disponibilità dell&apos;artista.</DialogDescription>
          </DialogHeader>

          <div className='h-full grid grid-rows-[max-content_1fr] md:grid-rows-none md:grid-cols-2 gap-4 py-4 border-t border-b overflow-hidden'>
            <Calendar
              locale={it}
              mode='single'
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={loading || isLoading ? true : { before: new Date() }}
              className='h-max p-0 self-center'
            />

            {selectedDate ? (
              <div className='flex flex-col overflow-y-auto'>
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
                  {!isLoading && availabilities.length === 0 && <div className='text-sm text-zinc-500'>Nessuna disponibilità. Aggiungine una per vederla nella lista.</div>}
                  {!isLoading &&
                    availabilities.length > 0 &&
                    availabilities.map((av, index) => {
                      const canDelete = !('canDelete' in av) || av?.canDelete;

                      return (
                        <div
                          key={index}
                          className='h-10 flex gap-2 justify-between items-center bg-zinc-50 px-2 rounded-xl'
                        >
                          <span>
                            {format(av.startDate, 'HH:mm')}
                            <span className='text-zinc-400 mx-1'>-</span>
                            {format(av.endDate, 'HH:mm')}
                          </span>
                          {canDelete && (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-destructive'
                              onClick={() => removeAvailability(av.id)}
                              disabled={loading || isLoading}
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
        </DialogContent>
      </Dialog>
    </>
  );
}
