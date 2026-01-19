'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events, venues } from '@/lib/database/schema';
import { ArtistAvailability } from '@/lib/types';
import { and, eq, sql } from 'drizzle-orm';

export async function getArtistRangeAvailabilities({
  artistSlug,
  artistId,
  startDate,
  endDate,
}: {
  artistSlug?: string;
  artistId?: number | null;
  startDate: string;
  endDate: string;
}): Promise<ArtistAvailability[]> {
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

  try {
    let resolvedArtistId = artistId ?? null;
    if (!resolvedArtistId) {
      if (!artistSlug) {
        throw new Error('Dati artista mancanti.');
      }
      const artistResult = await database
        .select({
          id: artists.id,
        })
        .from(artists)
        .where(and(eq(artists.slug, artistSlug)));

      resolvedArtistId = artistResult[0]?.id ?? null;
    }

    if (!resolvedArtistId) {
      throw new Error('Recupero artista non riuscito.');
    }

    const rangeWindow = sql`tstzrange(
                            ${startDate}::timestamptz,
                            ${endDate}::timestamptz,
                            '[]')`;

    const availabilitiesResult = await database
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
          eq(artistAvailabilities.artistId, resolvedArtistId),
          sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
        ),
      )
      .orderBy(artistAvailabilities.startDate);

    if (!availabilitiesResult.length) return [];

    return (availabilitiesResult as RawAvailabilityRow[]).map((availability) => {
      const event = availability.eventId
        ? {
            id: Number(availability.eventId),
            title: availability.eventTitle as string | null,
            status: availability.eventStatus as NonNullable<ArtistAvailability['event']>['status'],
            eventType: availability.eventType as NonNullable<ArtistAvailability['event']>['eventType'],
            venue: {
              id: Number(availability.venueId),
              name: availability.venueName as string,
              city: availability.venueCity as string | null,
            },
          }
        : null;

      return {
        id: Number(availability.id),
        artistId: Number(availability.artistId),
        startDate: availability.startDate as Date,
        endDate: availability.endDate as Date,
        status: availability.status as ArtistAvailability['status'],
        event,
      };
    });
  } catch (error) {
    console.error('[getArtistRangeAvailabilities] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
