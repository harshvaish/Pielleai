'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, endOfDay, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { notFound, useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { TIME_ZONE } from '@/lib/constants';
import { EVENT_STATUS_LABELS } from '@/lib/constants';
import { ArtistAvailability, AvailabilityStatus, EventType } from '@/lib/types';
import { fetcher } from '@/lib/utils';

const AVAILABILITY_STATUS_LABELS: Record<AvailabilityStatus, string> = {
  available: 'Indisponibilita',
  booked: 'Prenotato',
  expired: 'Scaduto',
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'dj-set': 'DJ set',
  live: 'Live',
  festival: 'Festival',
};

type AvailabilitiesTableProps = {
  calendarRange: { start: Date; end: Date };
};

export default function AvailabilitiesTable({ calendarRange }: AvailabilitiesTableProps) {
  const { slug } = useParams();
  if (!slug || typeof slug !== 'string') notFound();
  const router = useRouter();

  const [availabilities, setAvailabilities] = useState<ArtistAvailability[]>([]);

  const startDateUTC = useMemo(() => {
    return fromZonedTime(startOfDay(calendarRange.start), TIME_ZONE).toISOString();
  }, [calendarRange.start]);

  const endDateUTC = useMemo(() => {
    return fromZonedTime(endOfDay(calendarRange.end), TIME_ZONE).toISOString();
  }, [calendarRange.end]);

  const fetchUrl = `/api/artist-availabilities/range?s=${slug}&sd=${startDateUTC}&ed=${endDateUTC}`;
  const { data: response, isLoading } = useSWR(fetchUrl, fetcher);

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      setAvailabilities([]);
      return;
    }

    setAvailabilities(
      response.data.map((availability: ArtistAvailability) => ({
        ...availability,
        startDate: toZonedTime(availability.startDate, TIME_ZONE),
        endDate: toZonedTime(availability.endDate, TIME_ZONE),
      })),
    );
  }, [response]);

  return (
    <div className='relative'>
      {isLoading && <Skeleton className='absolute inset-0 z-50 opacity-60 rounded-xl' />}

      {availabilities.length > 0 ? (
        <Table className='w-full'>
          <TableHeader className='bg-zinc-50'>
            <TableRow>
              <TableHead>Inizio</TableHead>
              <TableHead>Fine</TableHead>
              <TableHead>Impegno</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Locale</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availabilities.map((availability) => {
              const startLabel = format(availability.startDate, 'dd/MM/yyyy, HH:mm');
              const endLabel = format(availability.endDate, 'dd/MM/yyyy, HH:mm');
              const eventTitle = availability.event?.title?.trim();
              const eventLabel = availability.event
                ? eventTitle
                  ? eventTitle
                  : availability.event.eventType
                    ? EVENT_TYPE_LABELS[availability.event.eventType]
                    : `Evento #${availability.event.id}`
                : '-';
              const venueLabel = availability.event?.venue.name ?? '-';
              const statusLabel = availability.event
                ? EVENT_STATUS_LABELS[availability.event.status]
                : AVAILABILITY_STATUS_LABELS[availability.status];
              const commitmentLabel = availability.event ? 'Evento' : 'Indisponibilita';

              return (
                <TableRow key={availability.id}>
                  <TableCell>{startLabel}</TableCell>
                  <TableCell>{endLabel}</TableCell>
                  <TableCell>{commitmentLabel}</TableCell>
                  <TableCell className='font-medium'>{eventLabel}</TableCell>
                  <TableCell>{venueLabel}</TableCell>
                  <TableCell>{statusLabel}</TableCell>
                  <TableCell>
                    {availability.event ? (
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => router.push(`/eventi/${availability.event?.id}`)}
                      >
                        Dettagli
                      </Button>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <section className='flex flex-col justify-center items-center bg-zinc-50 rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessuna disponibilità</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Nessuna disponibilita trovata per l'intervallo selezionato.
          </div>
        </section>
      )}
    </div>
  );
}
