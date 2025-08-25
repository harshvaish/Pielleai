'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists } from '@/lib/database/schema';
import { ServerActionResponse, Availability } from '@/lib/types';
import { addDays } from 'date-fns';
import { eq, and, sql, count } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod/v4';

export async function createArtistAvailability(artistSlug: string, newAvailability: Availability): Promise<ServerActionResponse<null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[createArtistAvailability] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      artistSlug: z.uuid("Seleziona un'opzione valida."),
      newAvailability: z.object({
        startDate: z.date('Data di inizio non valida'),
        endDate: z.date('Data di inizio non valida'),
      }),
    });

    const validation = schema.safeParse({ artistSlug, newAvailability });
    if (!validation.success) {
      console.error('[createArtistAvailability] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const artistResult = await database
      .select({
        id: artists.id,
      })
      .from(artists)
      .where(and(eq(artists.slug, artistSlug)));

    const artistId = artistResult[0]?.id;

    if (!artistId) throw new AppError('Artista non trovato.');

    const availabilityWindow = sql`tstzrange(
                                ${newAvailability.startDate}::timestamptz,
                                ${addDays(newAvailability.startDate, 1).toISOString()}::timestamptz,
                                '[)')`;

    // select candidates for delete
    const [check] = await database
      .select({ count: count() })
      .from(artistAvailabilities)
      .where(and(eq(artistAvailabilities.artistId, artistId), sql`${artistAvailabilities.timeRange} && ${availabilityWindow}`));

    if (check.count > 0) {
      throw new AppError('La nuova disponibilità è in conflitto con una già presente.');
    }

    // Insert new availabilities
    await database.insert(artistAvailabilities).values({
      artistId,
      startDate: newAvailability.startDate,
      endDate: newAvailability.endDate,
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[createArtistAvailability] error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento disponibilità artista non riuscito',
      data: null,
    };
  }
}
