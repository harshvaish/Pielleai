'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists } from '@/lib/database/schema';
import { ArtistAvailability } from '@/lib/types';
import { and, eq, sql } from 'drizzle-orm';

export async function getArtistRangeAvailabilities({ artistSlug, startDate, endDate }: { artistSlug: string; startDate: string; endDate: string }): Promise<ArtistAvailability[]> {
  try {
    const artistResult = await database
      .select({
        id: artists.id,
      })
      .from(artists)
      .where(and(eq(artists.slug, artistSlug)));

    const artistId = artistResult[0]?.id;

    if (!artistId) {
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
      .where(and(eq(artistAvailabilities.artistId, artistId), sql`${artistAvailabilities.timeRange} && ${rangeWindow}`))
      .orderBy(artistAvailabilities.startDate);

    if (!availabilitiesResult.length) return [];

    return availabilitiesResult;
  } catch (error) {
    console.error('[getArtistRangeAvailabilities] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
