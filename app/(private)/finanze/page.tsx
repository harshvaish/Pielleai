import { TablePagination } from '../_components/form/TablePagination';
import StatusFilterButton from '../eventi/_components/filters/StatusFilterButton';
import FiltersButton from '../eventi/_components/filters/FiltersButton';
import DatesFilterButton from '../eventi/_components/filters/DatesFilterButton';
import ConflictFilterButton from '../eventi/_components/filters/ConflictFilterButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EventsTableFilters, EventStatus } from '@/lib/types';
import { eventsFiltersSchema } from '@/lib/validation/filters/events-filters-schema';
import { hasRole, resolveNextPath, splitCsv } from '@/lib/utils';
import { getArtistsCached } from '@/lib/cache/artists';
import { getArtistManagersCached } from '@/lib/cache/artist-managers';
import { getVenuesCached } from '@/lib/cache/venues';
import { getEvents } from '@/lib/data/events/get-events';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { notFound, redirect } from 'next/navigation';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import EventStatusBadge from '../_components/Badges/EventStatusBadge';
import ArtistsBadge from '../_components/Badges/ArtistsBadge';
import VenuesBadge from '../_components/Badges/VenuesBadge';
import Link from 'next/link';
import { generateEventTitle } from '@/lib/utils/generate-event-title';

export const dynamic = 'force-dynamic';

type FinanzePageProps = {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    conflict?: string;
    artist?: string;
    manager?: string;
    venue?: string;
    start?: string;
    end?: string;
  }>;
};

const currencyFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'string' ? Number(value) : value;
  return Number.isNaN(parsed) ? null : parsed;
};

const formatCurrency = (value: string | number | null | undefined) => {
  const parsed = toNumber(value);
  return parsed === null ? '-' : currencyFormatter.format(parsed);
};

const formatPercentage = (value: string | number | null | undefined) => {
  const parsed = toNumber(value);
  return parsed === null ? '-' : `${parsed}%`;
};

const computeBookingAmount = (
  moCost: string | number | null | undefined,
  bookingPercentage: string | number | null | undefined,
) => {
  const cost = toNumber(moCost);
  const percentage = toNumber(bookingPercentage);
  if (cost === null || percentage === null) return null;
  return cost * (percentage / 100);
};

export default async function FinanzePage({ searchParams }: FinanzePageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin'])) {
    notFound();
  }

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? '1');

  const filters: EventsTableFilters = {
    currentPage: currentPage,
    status: splitCsv(sp?.status) as EventStatus[],
    conflict: sp?.conflict === 'true',
    artistIds: splitCsv(sp?.artist),
    artistManagerIds: splitCsv(sp?.manager),
    venueIds: splitCsv(sp?.venue),
    startDate: sp?.start ? new Date(sp.start) : null,
    endDate: sp?.end ? new Date(sp.end) : null,
  };

  const validation = eventsFiltersSchema.safeParse(filters);
  if (!validation.success) {
    notFound();
  }

  const [{ data: events, totalPages }, artists, artistManagers, venues] = await Promise.all([
    getEvents(user, filters),
    getArtistsCached(),
    getArtistManagersCached(),
    getVenuesCached(),
  ]);

  return (
    <div className='h-full grid grid-rows-[min-content_min-content_1fr_min-content] gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl md:text-2xl font-bold'>Finanze</h1>
      </div>

      <div className='w-full flex flex-col lg:flex-row justify-between items-end lg:items-center gap-4 overflow-hidden'>
        <div className='max-w-full bg-white flex items-center gap-1 p-1 rounded-2xl overflow-auto'>
          <StatusFilterButton
            status='proposed'
            label='Proposto'
            singleSelect
          />
          <StatusFilterButton
            status='pre-confirmed'
            label='Pre confermato'
            singleSelect
          />
          <StatusFilterButton
            status='confirmed'
            label='Confermato'
            singleSelect
          />
          <StatusFilterButton
            status='rejected'
            label='Rifiutato'
            singleSelect
          />
          <StatusFilterButton
            status='ended'
            label='Finito'
            singleSelect
          />
        </div>
        <div className='flex items-center gap-2'>
          <ConflictFilterButton />
          <FiltersButton
            userRole={user.role}
            filters={filters}
            artists={artists}
            artistManagers={artistManagers}
            venues={venues}
          />
          <DatesFilterButton filters={filters} />
        </div>
      </div>

      {events.length > 0 ? (
        <div className='max-h-full bg-white p-4 rounded-2xl overflow-auto'>
          <Table className='min-w-[1400px]'>
            <TableHeader className='bg-zinc-50'>
              <TableRow>
                <TableHead>Titolo evento</TableHead>
                <TableHead>Data evento</TableHead>
                <TableHead>Artista</TableHead>
                <TableHead>Locale</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className='text-right'>Cachet lordo</TableHead>
                <TableHead className='text-right'>Acconto</TableHead>
                <TableHead className='text-right'>Fee promoter</TableHead>
                <TableHead className='text-right'>% Booking</TableHead>
                <TableHead className='text-right'>Booking</TableHead>
                <TableHead className='text-right'>Spese anticipate</TableHead>
                <TableHead className='text-right'>Netto artista</TableHead>
                <TableHead className='text-right'>Saldo</TableHead>
                <TableHead>Data pagamento</TableHead>
                <TableHead>Fattura acconto</TableHead>
                <TableHead>Promoter</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const eventDate = format(event.availability.startDate, 'dd/MM/yyyy', {
                  locale: it,
                });
                const bookingAmount = computeBookingAmount(
                  event.moCost,
                  event.bookingPercentage,
                );
                const promoterLabel = event.venue.manager
                  ? `${event.venue.manager.name} ${event.venue.manager.surname}`
                  : '-';
                const paymentDate = event.paymentDate
                  ? format(event.paymentDate, 'dd/MM/yyyy', { locale: it })
                  : '-';
                const eventTitle =
                  event.title?.trim() ||
                  generateEventTitle(
                    event.artist.stageName?.trim() ||
                      `${event.artist.name} ${event.artist.surname}`.trim(),
                    event.venue.name,
                    event.availability.startDate,
                    event.availability.endDate,
                  );

                return (
                  <TableRow key={event.id}>
                    <TableCell className='whitespace-nowrap'>
                      <Link
                        href={`/eventi/${event.id}`}
                        className='font-medium text-zinc-900 hover:underline'
                      >
                        {eventTitle}
                      </Link>
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>{eventDate}</TableCell>
                    <TableCell className='whitespace-nowrap'>
                      <ArtistsBadge
                        artists={[event.artist]}
                        userRole={user.role}
                      />
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>
                      <VenuesBadge
                        userRole={user.role}
                        venues={[event.venue]}
                      />
                    </TableCell>
                    <TableCell>
                      <EventStatusBadge
                        status={event.status}
                        size='sm'
                      />
                    </TableCell>
                    <TableCell className='text-right tabular-nums whitespace-nowrap'>
                      {formatCurrency(event.moCost)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums whitespace-nowrap'>
                      {formatCurrency(event.depositCost)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums whitespace-nowrap'>
                      {formatCurrency(event.venueManagerCost)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums whitespace-nowrap'>
                      {formatPercentage(event.bookingPercentage)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums whitespace-nowrap'>
                      {formatCurrency(bookingAmount)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums whitespace-nowrap'>
                      {formatCurrency(event.moArtistAdvancedExpenses)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums whitespace-nowrap'>
                      {formatCurrency(event.artistNetCost)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums whitespace-nowrap'>
                      {formatCurrency(event.artistUpfrontCost)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>{paymentDate}</TableCell>
                    <TableCell className='whitespace-nowrap'>
                      {event.depositInvoiceNumber || '-'}
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>{promoterLabel}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <section className='flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun evento</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
        </section>
      )}

      {events.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
