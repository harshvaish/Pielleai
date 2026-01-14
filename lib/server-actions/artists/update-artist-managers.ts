'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq, inArray } from 'drizzle-orm';
import { artists, managerArtists, profiles, users } from '@/lib/database/schema';
import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import { idValidation } from '@/lib/validation/_general';
import { hasRole } from '@/lib/utils';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const updateArtistManagers = async (
  artistId: number,
  managerProfileIds: number[],
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateArtistManagers] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      console.error('[updateArtistManagers] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      artistId: idValidation,
      managerProfileIds: z.array(idValidation).optional(),
    });

    const validation = schema.safeParse({ artistId, managerProfileIds });
    if (!validation.success) {
      console.error('[updateArtistManagers] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('Dati inviati non corretti.');
    }

    const safeManagerIds = [...new Set(validation.data.managerProfileIds ?? [])];

    const [artist] = await database
      .select({ id: artists.id, slug: artists.slug })
      .from(artists)
      .where(eq(artists.id, validation.data.artistId))
      .limit(1);

    if (!artist) {
      throw new AppError('Artista non trovato.');
    }

    if (safeManagerIds.length > 0) {
      const managersCheck = await database
        .select({ id: profiles.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(and(eq(users.role, 'artist-manager'), inArray(profiles.id, safeManagerIds)));

      if (managersCheck.length !== safeManagerIds.length) {
        throw new AppError('Uno o più manager selezionati non validi.');
      }
    }

    const existingManagers = await database
      .select({ managerProfileId: managerArtists.managerProfileId })
      .from(managerArtists)
      .where(eq(managerArtists.artistId, validation.data.artistId));

    const managerIdsToRevalidate = [
      ...new Set([
        ...existingManagers.map((m) => m.managerProfileId),
        ...safeManagerIds,
      ]),
    ];

    await database.transaction(async (tx) => {
      await tx.delete(managerArtists).where(eq(managerArtists.artistId, validation.data.artistId));

      if (safeManagerIds.length > 0) {
        await tx.insert(managerArtists).values(
          safeManagerIds.map((managerProfileId) => ({
            artistId: validation.data.artistId,
            managerProfileId,
          })),
        );
      }
    });

    if (managerIdsToRevalidate.length > 0) {
      const managerUsers = await database
        .select({ userId: profiles.userId })
        .from(profiles)
        .where(inArray(profiles.id, managerIdsToRevalidate));

      managerUsers.forEach((manager) => {
        revalidateTag(`artist-manager:${manager.userId}`, 'max');
      });
    }

    revalidateTag(`artist:${artist.slug}`, 'max');
    revalidateTag('artists', 'max');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateArtistManagers] transaction failed:', error);

    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Aggiornamento manager non riuscito.',
      data: null,
    };
  }
};
