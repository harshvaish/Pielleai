'server only';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events, venues } from '@/lib/database/schema';
import { ArtistEventListItem, ArtistEventsTableFilters } from '@/lib/types';
import { and, count, eq, inArray, sql } from 'drizzle-orm';
import { latestRevisionFilter } from './revision-helpers';

const MAX_RANGE_END = new Date('9999-12-31T23:59:59.999Z');

export async function getArtistEvents(
  artistId: number,
  { currentPage, status, venueIds, startDate, endDate }: ArtistEventsTableFilters,
): Promise<{
  data: ArtistEventListItem[];
  totalPages: number;
  currentPage: number;
}> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;
  const isPaginated = Number.isInteger(currentPage) && (currentPage as number) > 0;
  const safePage = isPaginated ? (currentPage as number) : 1;
  const offset = (safePage - 1) * limit;

  const wantsHistory = status.some((value) => value === 'ended' || value === 'rejected');
  const rangeStart = startDate ?? new Date(0);
  const rangeEnd = endDate ?? MAX_RANGE_END;
  const useUpcomingWindow = !startDate && !endDate && !wantsHistory;

  const rangeWindow = useUpcomingWindow
    ? sql`tstzrange(${new Date()}::timestamptz, 'infinity'::timestamptz, '[)')`
    : sql`tstzrange(${rangeStart}::timestamptz, ${rangeEnd}::timestamptz, '[)')`;

  try {
    const filters = and(
      latestRevisionFilter,
      eq(events.artistId, artistId),
      status.length > 0 ? inArray(events.status, status) : undefined,
      venueIds.length > 0 ? inArray(events.venueId, venueIds.map(Number)) : undefined,
      sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
    );

    let baseQuery = database
      .select({
        id: events.id,
        title: events.title,
        artist: {
          id: artists.id,
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
        },
        status: events.status,
        eventType: events.eventType,
        startDate: artistAvailabilities.startDate,
        endDate: artistAvailabilities.endDate,
        venue: {
          id: venues.id,
          name: venues.name,
          city: venues.city,
        },
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .innerJoin(artists, eq(events.artistId, artists.id))
      .where(filters)
      .orderBy(artistAvailabilities.startDate);

    if (isPaginated) {
      // @ts-expect-error drizzle typing allows chaining here at runtime
      baseQuery = baseQuery.limit(limit).offset(offset);
    }

    const [eventsResult, [{ eventCount }]] = await Promise.all([
      baseQuery,
      database
        .select({ eventCount: count() })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .where(filters),
    ]);

    const totalPages = isPaginated ? Math.max(1, Math.ceil(Number(eventCount) / limit)) : 1;

    return {
      data: eventsResult as ArtistEventListItem[],
      totalPages,
      currentPage: safePage,
    };
  } catch (error) {
    console.error('[getArtistEvents] - Error:', error);
    throw new Error('Recupero eventi artista non riuscito.');
  }
}
