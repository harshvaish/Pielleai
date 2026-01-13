import { TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/app/(private)/_components/form/TablePagination';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';
import { splitCsv } from '@/lib/utils';
import { ArtistEventsTableFilters, EventStatus, EventType, VenueSelectData } from '@/lib/types';
import { artistEventsFiltersSchema } from '@/lib/validation/filters/artist-events-filters-schema';
import { getArtistEvents } from '@/lib/data/events/get-artist-events';
import ArtistEventsStatusFilters from '../Events/ArtistEventsStatusFilters';
import ArtistEventsDatesFilterButton from '../Events/ArtistEventsDatesFilterButton';
import ArtistEventsVenueFilter from '../Events/ArtistEventsVenueFilter';
import ArtistEventRow from '../Events/ArtistEventRow';

const DEFAULT_STATUSES: EventStatus[] = ['proposed', 'pre-confirmed', 'confirmed'];

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'dj-set': 'DJ set',
  live: 'Live',
  festival: 'Festival',
};

type ArtistEventsTabProps = {
  tabValue: string;
  artistId: number;
  venues: VenueSelectData[];
  searchParams?: {
    page?: string;
    status?: string;
    venue?: string;
    start?: string;
    end?: string;
  };
};

export default async function ArtistEventsTab({
  tabValue,
  artistId,
  venues,
  searchParams,
}: ArtistEventsTabProps) {
  const currentPage = Number(searchParams?.page ?? '1');
  const requestedStatuses = splitCsv(searchParams?.status) as EventStatus[];
  const status = requestedStatuses.length > 0 ? requestedStatuses : DEFAULT_STATUSES;

  const filters: ArtistEventsTableFilters = {
    currentPage,
    status,
    venueIds: splitCsv(searchParams?.venue),
    startDate: searchParams?.start ? new Date(searchParams.start) : null,
    endDate: searchParams?.end ? new Date(searchParams.end) : null,
  };

  const validation = artistEventsFiltersSchema.safeParse(filters);
  if (!validation.success) {
    notFound();
  }

  const { data: events, totalPages } = await getArtistEvents(artistId, filters);
  const now = new Date();
  const hasActiveFilters = Boolean(
    searchParams?.status || searchParams?.venue || searchParams?.start || searchParams?.end,
  );

  return (
    <TabsContent
      value={tabValue}
      className='w-full bg-white py-4 px-6 rounded-2xl overflow-hidden'
    >
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
          <ArtistEventsStatusFilters />
          <div className='flex items-center gap-2'>
            <ArtistEventsVenueFilter venues={venues} />
            <ArtistEventsDatesFilterButton
              startDate={filters.startDate}
              endDate={filters.endDate}
            />
          </div>
        </div>

        {events.length > 0 ? (
          <>
            <Table className='w-full'>
              <TableHeader className='bg-zinc-50'>
                <TableRow>
                  <TableHead>Inizio evento</TableHead>
                  <TableHead>Fine evento</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead>Città</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const startLabel = format(toZonedTime(event.startDate, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
                  const endLabel = format(toZonedTime(event.endDate, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
                  const eventLabel = event.eventType
                    ? EVENT_TYPE_LABELS[event.eventType]
                    : `Evento #${event.id}`;
                  const isOngoing = event.startDate <= now && event.endDate >= now;

                  return (
                    <ArtistEventRow
                      key={event.id}
                      event={event}
                      startLabel={startLabel}
                      endLabel={endLabel}
                      eventLabel={eventLabel}
                      isOngoing={isOngoing}
                    />
                  );
                })}
              </TableBody>
            </Table>

            {events.length > 0 && totalPages > 1 && (
              <TablePagination
                totalPages={totalPages}
                currentPage={currentPage}
                searchParams={searchParams ?? {}}
              />
            )}
          </>
        ) : (
          <section className='flex flex-col justify-center items-center bg-zinc-50 rounded-2xl p-8'>
            <h2 className='text-base font-bold'>
              {hasActiveFilters ? 'Nessun evento con i filtri selezionati' : 'Nessun evento'}
            </h2>
            <div className='text-sm font-medium text-zinc-400'>
              {hasActiveFilters
                ? 'Modifica i filtri per visualizzare altri eventi.'
                : 'Nessun evento associato a questo artista.'}
            </div>
          </section>
        )}
      </div>
    </TabsContent>
  );
}
