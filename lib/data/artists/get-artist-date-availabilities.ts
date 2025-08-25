'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events } from '@/lib/database/schema';
import { ArtistAvailability } from '@/lib/types';
import { addDays } from 'date-fns';
import { and, count, eq, inArray, or, sql } from 'drizzle-orm';

type getArtistDateAvailabilitiesParams = {
  artistId: number | null;
  artistSlug: string | null;
  startDate: string;
};

export async function getArtistDateAvailabilities({ artistId, artistSlug, startDate }: getArtistDateAvailabilitiesParams): Promise<ArtistAvailability[]> {
  if (!artistId && !artistSlug) throw new Error('Dati artista mancanti.');

  let id = artistId ? artistId : null;

  try {
    if (!id) {
      // 1) Resolve artist id
      const artistRow = await database.select({ id: artists.id }).from(artists).where(eq(artists.slug, artistSlug!));

      id = artistRow[0]?.id;

      if (!id) {
        throw new Error('Recupero artista non riuscito.');
      }
    }

    const dayWindow = sql`tstzrange(
                            ${startDate}::timestamptz,
                            ${addDays(new Date(startDate), 1).toISOString()}::timestamptz,
                            '[)')`;

    // 3) Fetch availabilities for the day
    const rows = await database
      .select({
        id: artistAvailabilities.id,
        startDate: artistAvailabilities.startDate,
        endDate: artistAvailabilities.endDate,
        status: artistAvailabilities.status,
      })
      .from(artistAvailabilities)
      .where(and(eq(artistAvailabilities.artistId, id), sql`${artistAvailabilities.timeRange} && ${dayWindow}`))
      .orderBy(artistAvailabilities.startDate);

    if (rows.length === 0) return [];

    // 4) Fetch counts of "protected" events per availability (pre-confirmed/confirmed or previous pre-confirmed)
    const availabilityIds = rows.map((r) => r.id);

    const protectedCounts = await database
      .select({
        availabilityId: events.availabilityId,
        cnt: count(),
      })
      .from(events)
      .where(and(inArray(events.availabilityId, availabilityIds), or(inArray(events.status, ['pre-confirmed', 'confirmed']), eq(events.previousStatus, 'pre-confirmed'))))
      .groupBy(events.availabilityId);

    const protectedMap = new Map<number, number>();
    for (const r of protectedCounts) protectedMap.set(r.availabilityId, Number(r.cnt));

    // 5) Compute canDelete
    const result: ArtistAvailability[] = rows.map((r) => {
      const protectedCount = protectedMap.get(r.id) ?? 0;
      const canDelete = r.status !== 'booked' && protectedCount === 0;
      return { ...r, canDelete };
    });

    return result;
  } catch (error) {
    console.error('[getArtistAvailabilitiesFromDate] - Error:', error);
    throw new Error('Recupero disponibilità artista non riuscito.');
  }
}
