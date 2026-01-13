'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events } from '@/lib/database/schema';
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

    // 3) Fetch unavailability blocks for the day (availabilities not linked to events)
    const rows = await database
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
          eq(artistAvailabilities.artistId, id),
          sql`${artistAvailabilities.timeRange} && ${dayWindow}`,
          sql`${events.id} is null`,
        ),
      )
      .orderBy(artistAvailabilities.startDate);

    if (rows.length === 0) return [];

    return rows.map((row) => ({
      ...row,
      canDelete: true,
    }));
  } catch (error) {
    console.error('[getArtistAvailabilitiesFromDate] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
