'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities } from '@/lib/database/schema';
import { ArtistAvailability } from '@/lib/types';
import { and, eq, sql } from 'drizzle-orm';

export async function getArtistAvailableAvailabilities({
  artistId,
}: {
  artistId: number;
}): Promise<ArtistAvailability[]> {
  try {
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
          eq(artistAvailabilities.status, 'available'),
          sql`${artistAvailabilities.startDate} >= CURRENT_DATE`
        )
      )
      .orderBy(artistAvailabilities.startDate);

    return availabilitiesResult;
  } catch (error) {
    console.error('[getArtistAvailableAvailabilities] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
