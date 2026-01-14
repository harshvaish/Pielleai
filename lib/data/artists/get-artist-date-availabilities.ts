'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events, venues } from '@/lib/database/schema';
import { ArtistAvailability } from '@/lib/types';
import { addDays } from 'date-fns';
import { and, eq, sql } from 'drizzle-orm';

type getArtistDateAvailabilitiesParams = {
  artistId: number | null;
  artistSlug: string | null;
  startDate: string;
};

export async function getArtistDateAvailabilities({
  artistId,
  artistSlug,
  startDate,
}: getArtistDateAvailabilitiesParams): Promise<ArtistAvailability[]> {
  type RawAvailabilityRow = {
    id: unknown;
    artistId: unknown;
    startDate: unknown;
    endDate: unknown;
    status: unknown;
    eventId: unknown;
    eventTitle: unknown;
    eventStatus: unknown;
    eventType: unknown;
    venueId: unknown;
    venueName: unknown;
    venueCity: unknown;
  };

  if (!artistId && !artistSlug) throw new Error('Dati artista mancanti.');

  let id = artistId ? artistId : null;

  try {
    if (!id) {
      // 1) Resolve artist id
      const artistRow = await database
        .select({ id: artists.id })
        .from(artists)
        .where(eq(artists.slug, artistSlug!));

      id = artistRow[0]?.id;

      if (!id) {
        throw new Error('Recupero artista non riuscito.');
      }
    }

    const dayWindow = sql`tstzrange(
                            ${startDate}::timestamptz,
                            ${addDays(new Date(startDate), 1).toISOString()}::timestamptz,
                            '[)')`;

    // Fetch unavailability + booked events for the day
    const rows = await database
      .select({
        id: artistAvailabilities.id,
        artistId: artistAvailabilities.artistId,
        startDate: artistAvailabilities.startDate,
        endDate: artistAvailabilities.endDate,
        status: artistAvailabilities.status,
        eventId: events.id,
        eventTitle: events.title,
        eventStatus: events.status,
        eventType: events.eventType,
        venueId: venues.id,
        venueName: venues.name,
        venueCity: venues.city,
      })
      .from(artistAvailabilities)
      .leftJoin(events, eq(events.availabilityId, artistAvailabilities.id))
      .leftJoin(venues, eq(events.venueId, venues.id))
      .where(
        and(
          eq(artistAvailabilities.artistId, id),
          sql`${artistAvailabilities.timeRange} && ${dayWindow}`,
        ),
      )
      .orderBy(artistAvailabilities.startDate);

    if (rows.length === 0) return [];

    return (rows as RawAvailabilityRow[]).map((row) => {
      const event = row.eventId
        ? {
            id: Number(row.eventId),
            title: row.eventTitle as string | null,
            status: row.eventStatus as NonNullable<ArtistAvailability['event']>['status'],
            eventType: row.eventType as NonNullable<ArtistAvailability['event']>['eventType'],
            venue: {
              id: Number(row.venueId),
              name: row.venueName as string,
              city: row.venueCity as string | null,
            },
          }
        : null;

      return {
        id: Number(row.id),
        artistId: Number(row.artistId),
        startDate: row.startDate as Date,
        endDate: row.endDate as Date,
        status: row.status as ArtistAvailability['status'],
        event,
        canDelete: !row.eventId,
      };
    });
  } catch (error) {
    console.error('[getArtistAvailabilitiesFromDate] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
