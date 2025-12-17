'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { artists } from '@/lib/database/schema';
import { ServerActionResponse, UserStatus } from '@/lib/types';
import { hasRole } from '@/lib/utils';
import { idValidation, userStatusEnumValidation } from '@/lib/validation/_general';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod/v4';

export async function toggleArtistStatus(
  artistId: number,
  initialStatus: UserStatus,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[toggleArtistStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      console.error('[toggleArtistStatus] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      artistId: idValidation,
      initialStatus: userStatusEnumValidation,
    });

    const validation = schema.safeParse({ artistId, initialStatus });

    if (!validation.success) {
      console.error('[toggleArtistStatus] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const newStatus: UserStatus = initialStatus === 'active' ? 'disabled' : 'active';

    const updateResult = await database
      .update(artists)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(artists.id, artistId))
      .returning({ slug: artists.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`artist:${slug}`, 'max');
    revalidateTag('artists', 'max');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[toggleArtistStatus] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento artista non riuscito.',
      data: null,
    };
  }
}
