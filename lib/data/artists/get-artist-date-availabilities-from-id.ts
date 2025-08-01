'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities } from '@/lib/database/schema';
import { ArtistAvailability } from '@/lib/types';
import { and, eq, or, sql } from 'drizzle-orm';

export async function getArtistDateAvailabilitiesFromId({
  artistId,
  date,
}: {
  artistId: string;
  date: string;
}): Promise<ArtistAvailability[]> {
  try {
    const id = parseInt(artistId);

    if (!id || isNaN(id)) return [];

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
          eq(artistAvailabilities.artistId, id),
          or(
            sql`DATE(${artistAvailabilities.startDate}) = ${date}::date`,
            sql`DATE(${artistAvailabilities.endDate}) = ${date}::date`
          )
        )
      )
      .orderBy(artistAvailabilities.startDate);

    if (!availabilitiesResult.length) return [];

    return availabilitiesResult;
  } catch (error) {
    console.error('[getArtistAvailabilitiesFromDate] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
