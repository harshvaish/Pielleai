'use server';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists } from '@/lib/database/schema';
import { ArtistAvailability } from '@/lib/types';
import { and, eq, or, sql } from 'drizzle-orm';

export async function getArtistAvailabilitiesFromRange({
  artistSlug,
  startDate,
  endDate,
}: {
  artistSlug: string;
  startDate: string;
  endDate: string;
}): Promise<ArtistAvailability[]> {
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

    const availabilitiesResult = await database
      .select({
        id: artistAvailabilities.id,
        startDate: artistAvailabilities.startDate,
        endDate: artistAvailabilities.endDate,
        status: artistAvailabilities.status,
      })
      .from(artistAvailabilities)
      .where(
        and(
          eq(artistAvailabilities.artistId, artistId),
          or(
            sql`DATE(${artistAvailabilities.startDate}) <= ${startDate}::date`,
            sql`DATE(${artistAvailabilities.endDate}) >= ${endDate}::date`
          )
        )
      )
      .orderBy(artistAvailabilities.startDate);

    if (!availabilitiesResult.length) return [];

    return availabilitiesResult;
  } catch (error) {
    console.error('[getArtistAvailabilitiesFromRange] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
