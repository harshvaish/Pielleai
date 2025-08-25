'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events } from '@/lib/database/schema';
import { TimeRange, ServerActionResponse } from '@/lib/types';
import { checkTimeRanges } from '@/lib/utils';
import { parse } from 'date-fns';
import { eq, and, or, sql, ne, inArray, notExists } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod/v4';

export async function updateArtistAvailabilities(artistSlug: string, date: string, timeRanges: TimeRange[]): Promise<ServerActionResponse<null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[updateArtistAvailabilities] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
    const HOUR_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

    const schema = z.object({
      artistSlug: z.uuid("Seleziona un'opzione valida."),
      date: z
        .string({ message: "Seleziona un'opzione valida." })
        .regex(DATE_RE, 'Campo malformato.')
        .refine((s) => {
          // real calendar date check (e.g., reject 2025-02-30)
          const d = new Date(`${s}T00:00:00Z`);
          const yy = `${d.getUTCFullYear()}`.padStart(4, '0');
          const mm = `${d.getUTCMonth() + 1}`.padStart(2, '0');
          const dd = `${d.getUTCDate()}`.padStart(2, '0');
          return `${yy}-${mm}-${dd}` === s;
        }, 'Data non valida.'),
      timeRanges: z
        .array(
          z.object({
            startTime: z.string().regex(HOUR_RE, 'Orario di inizio non valido.'),
            endTime: z.string().regex(HOUR_RE, 'Orario di fine non valido.'),
          })
        )
        .min(1, 'Inserisci almeno un intervallo.'),
    });

    const validation = schema.safeParse({ artistSlug, date, timeRanges });
    if (!validation.success) {
      console.error('[updateArtistAvailabilities] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const check = checkTimeRanges(date, timeRanges);
    if (!check.success) {
      throw new AppError(check.message);
    }

    return await database.transaction(async (tx) => {
      const artistResult = await tx
        .select({
          id: artists.id,
        })
        .from(artists)
        .where(and(eq(artists.slug, artistSlug)));

      const artistId = artistResult[0]?.id;

      if (!artistId) throw new AppError('Artista non trovato.');

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
            const start = parse(`${date} ${range.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
            const end = parse(`${date} ${range.endTime}`, 'yyyy-MM-dd HH:mm', new Date());

            return {
              artistId,
              startDate: start,
              endDate: end,
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
    console.error('[updateArtistAvailabilities] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento disponibilità artista non riuscito',
      data: null,
    };
  }
}
