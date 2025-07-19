'use server';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists } from '@/lib/database/schema';
import { TimeRange, ServerActionResponse } from '@/lib/types';
import { checkTimeRanges } from '@/lib/utils';
import { eq, and, or, sql } from 'drizzle-orm';

interface EditArtistAvailabilitiesParams {
  artistSlug: string;
  date: string; // Format YYYY-MM-DD
  timeRanges: TimeRange[];
}

export async function editArtistAvailabilities({
  artistSlug,
  date,
  timeRanges,
}: EditArtistAvailabilitiesParams): Promise<ServerActionResponse<null>> {
  const check = checkTimeRanges(date, timeRanges);
  if (!check.success) {
    return {
      success: false,
      message: check.message,
      data: null,
    };
  }

  try {
    const artistResult = await database
      .select({
        id: artists.id,
      })
      .from(artists)
      .where(and(eq(artists.slug, artistSlug)));

    const artistId = artistResult[0]?.id;

    if (!artistId)
      return {
        success: false,
        message: 'Artista non trovato.',
        data: null,
      };

    // Delete existing availabilities for that artist/date
    await database
      .delete(artistAvailabilities)
      .where(
        and(
          eq(artistAvailabilities.artistId, artistId),
          or(
            sql`DATE(${artistAvailabilities.startDate}) = ${date}::date`,
            sql`DATE(${artistAvailabilities.endDate}) = ${date}::date`
          )
        )
      );

    // Insert new availabilities
    if (timeRanges.length > 0) {
      await database.insert(artistAvailabilities).values(
        timeRanges.map((range) => ({
          artistId,
          date,
          startDate: new Date(`${date} ${range.startTime}`),
          endDate: new Date(`${date} ${range.endTime}`),
        }))
      );
    }

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[editArtistAvailabilities] ', error);
    return {
      success: false,
      message: 'Aggiornamento disponibilità artista non riuscito.',
      data: null,
    };
  }
}
