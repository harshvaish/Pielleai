'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq, inArray } from 'drizzle-orm';
import { artists, managerArtists, profiles, users } from '@/lib/database/schema';
import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import { idValidation } from '@/lib/validation/_general';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const updateManagedArtists = async (
  managerProfileId: number,
  artistIds: number[],
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateManagedArtists] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    const schema = z.object({
      managerProfileId: idValidation,
      artistIds: z.array(idValidation).optional(),
    });

    const validation = schema.safeParse({ managerProfileId, artistIds });
    if (!validation.success) {
      console.error('[updateManagedArtists] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('Dati inviati non corretti.');
    }

    if (user.role !== 'admin') {
      const userProfileIdCheck = await getUserProfileIdCached(user.id);
      if (!userProfileIdCheck || userProfileIdCheck !== validation.data.managerProfileId) {
        console.error('[updateManagedArtists] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
    }

    const manager = await database
      .select({ userId: profiles.userId })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(and(eq(profiles.id, validation.data.managerProfileId), eq(users.role, 'artist-manager')))
      .limit(1);

    if (!manager.length) {
      throw new AppError('Manager non valido.');
    }

    const safeArtistIds = [...new Set(validation.data.artistIds ?? [])];

    if (safeArtistIds.length > 0) {
      const artistsCheck = await database
        .select({ id: artists.id })
        .from(artists)
        .where(inArray(artists.id, safeArtistIds));

      if (artistsCheck.length !== safeArtistIds.length) {
        throw new AppError('Uno o più artisti selezionati non validi.');
      }
    }

    const existingArtists = await database
      .select({ artistId: managerArtists.artistId })
      .from(managerArtists)
      .where(eq(managerArtists.managerProfileId, validation.data.managerProfileId));

    const artistIdsToRevalidate = [
      ...new Set([
        ...existingArtists.map((a) => a.artistId),
        ...safeArtistIds,
      ]),
    ];

    const artistSlugs =
      artistIdsToRevalidate.length > 0
        ? await database
            .select({ slug: artists.slug })
            .from(artists)
            .where(inArray(artists.id, artistIdsToRevalidate))
        : [];

    await database.transaction(async (tx) => {
      await tx
        .delete(managerArtists)
        .where(eq(managerArtists.managerProfileId, validation.data.managerProfileId));

      if (safeArtistIds.length > 0) {
        await tx.insert(managerArtists).values(
          safeArtistIds.map((artistId) => ({
            managerProfileId: validation.data.managerProfileId,
            artistId,
          })),
        );
      }
    });

    revalidateTag(`artist-manager:${manager[0].userId}`, 'max');
    revalidateTag('artists', 'max');

    artistSlugs.forEach((artist) => {
      revalidateTag(`artist:${artist.slug}`, 'max');
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateManagedArtists] transaction failed:', error);

    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Aggiornamento artisti gestiti non riuscito.',
      data: null,
    };
  }
};
