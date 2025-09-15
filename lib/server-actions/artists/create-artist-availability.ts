'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists } from '@/lib/database/schema';
import { ServerActionResponse, Availability } from '@/lib/types';
import { hasRole } from '@/lib/utils';
import { dateValidation } from '@/lib/validation/_general';
import { eq, and, sql, count } from 'drizzle-orm';
import { z } from 'zod/v4';

export async function createArtistAvailability(
  artistSlug: string,
  newAvailability: Availability,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createArtistAvailability] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      console.error('[createArtistAvailability] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      artistSlug: z.uuid("Seleziona un'opzione valida."),
      newAvailability: z.object({
        startDate: dateValidation,
        endDate: dateValidation,
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

    console.log(newAvailability.startDate, newAvailability.endDate);

    const availabilityWindow = sql`tstzrange(
                                ${newAvailability.startDate}::timestamptz,
                                ${newAvailability.startDate}::timestamptz,
                                '[)')`;

    // check if cross another availability
    const [check] = await database
      .select({ count: count() })
      .from(artistAvailabilities)
      .where(
        and(
          eq(artistAvailabilities.artistId, artistId),
          sql`${artistAvailabilities.timeRange} && ${availabilityWindow}`,
        ),
      );

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
      message:
        error instanceof AppError
          ? error.message
          : 'Aggiornamento disponibilità artista non riuscito',
      data: null,
    };
  }
}
