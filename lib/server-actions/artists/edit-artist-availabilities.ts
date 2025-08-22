'use server';

import { TIME_ZONE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events } from '@/lib/database/schema';
import { TimeRange, ServerActionResponse } from '@/lib/types';
import { checkTimeRanges } from '@/lib/utils';
import { parse } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { eq, and, or, sql, ne, inArray, notExists } from 'drizzle-orm';

interface EditArtistAvailabilitiesParams {
  artistSlug: string;
  date: string; // Format YYYY-MM-DD
  timeRanges: TimeRange[];
}

export async function editArtistAvailabilities({ artistSlug, date, timeRanges }: EditArtistAvailabilitiesParams): Promise<ServerActionResponse<null>> {
  const check = checkTimeRanges(date, timeRanges);
  if (!check.success) {
    return {
      success: false,
      message: check.message,
      data: null,
    };
  }

  try {
    return await database.transaction(async (tx) => {
      const artistResult = await tx
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

      // Build a Postgres tsrange covering the entire given day e.g. 2025-08-12:
      //   [2025-08-12 00:00, 2025-08-13 00:00)
      // The '[)' bounds: include the start, exclude the end.
      // Later we use:  timeRange && dayWindow
      //   (&& -> Postgres "overlaps" operator)
      // to match any availability whose time_range touches this day,
      const dayWindow = sql`tsrange(${date}::timestamp, (${date}::date + 1)::timestamp, '[)')`;

      // select candidates for delete
      const candidates = await tx
        .select({ id: artistAvailabilities.id })
        .from(artistAvailabilities)
        .where(
          and(
            eq(artistAvailabilities.artistId, artistId),
            sql`${artistAvailabilities.timeRange} && ${dayWindow}`,
            ne(artistAvailabilities.status, 'booked'),
            notExists(
              tx
                .select({ id: events.id })
                .from(events)
                .where(and(eq(events.availabilityId, artistAvailabilities.id), or(inArray(events.status, ['pre-confirmed', 'confirmed']), eq(events.previousStatus, 'pre-confirmed'))))
            )
          )
        );

      const deleteIds = candidates.map((r) => r.id);

      if (deleteIds.length > 0) {
        // Delete allowed dependent events first (FK is RESTRICT)
        await tx.delete(events).where(inArray(events.availabilityId, deleteIds));
        // Delete availabilities for that artist/date
        await tx.delete(artistAvailabilities).where(inArray(artistAvailabilities.id, deleteIds));
      }

      // Insert new availabilities
      if (timeRanges.length > 0) {
        await tx.insert(artistAvailabilities).values(
          timeRanges.map((range) => {
            // parse as naive date
            const localStart = parse(`${date} ${range.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
            const localEnd = parse(`${date} ${range.endTime}`, 'yyyy-MM-dd HH:mm', new Date());

            // parse to UTC
            const startDateUTC = fromZonedTime(localStart, TIME_ZONE);
            const endDateUTC = fromZonedTime(localEnd, TIME_ZONE);

            return {
              artistId,
              startDate: startDateUTC,
              endDate: endDateUTC,
            };
          })
        );
      }

      return {
        success: true,
        message: null,
        data: null,
      };
    });
  } catch (error) {
    console.error('[editArtistAvailabilities] ', error);
    return {
      success: false,
      message: 'Aggiornamento disponibilità artista non riuscito.',
      data: null,
    };
  }
}
