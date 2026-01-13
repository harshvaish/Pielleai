'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events } from '@/lib/database/schema';
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
      })
      .from(artistAvailabilities)
      .leftJoin(events, eq(events.availabilityId, artistAvailabilities.id))
      .where(
        and(
          eq(artistAvailabilities.artistId, resolvedArtistId),
          sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
          sql`${events.id} is null`,
        ),
      )
      .orderBy(artistAvailabilities.startDate);

    if (!availabilitiesResult.length) return [];

    return availabilitiesResult;
  } catch (error) {
    console.error('[getArtistRangeAvailabilities] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
