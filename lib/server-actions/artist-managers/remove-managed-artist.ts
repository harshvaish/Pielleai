'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { managerArtists } from '@/lib/database/schema';
import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import { idValidation } from '@/lib/validation/_general';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const removeManagedArtist = async (
  managerProfileId: number,
  artistId: number,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[removeManagedArtist] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      const userProfileIdCheck = await getUserProfileIdCached(user.id);
      if (!userProfileIdCheck || userProfileIdCheck != managerProfileId) {
        console.error('[removeManagedArtist] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
    }

    const schema = z.object({
      managerProfileId: idValidation,
      artistId: idValidation,
    });

    const validation = schema.safeParse({ managerProfileId, artistId });

    if (!validation.success) {
      console.error(
        '[removeManagedArtist] - Error: validation failed - ',
        validation.error.issues[0],
      );
      throw new AppError('Dati inviati non corretti.');
    }

    const result = await database
      .delete(managerArtists)
      .where(
        and(
          eq(managerArtists.managerProfileId, managerProfileId),
          eq(managerArtists.artistId, artistId),
        ),
      );

    const deletedRows = result.rowCount;

    if (!deletedRows) {
      throw new AppError('Artista non trovato.');
    }

    revalidateTag(`profile:${user.id}`, 'max');
    revalidateTag(`artist-manager:${user.id}`, 'max');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[removeManagedArtist] transaction failed:', error);

    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Rimozione artista gestito non riuscita.',
      data: null,
    };
  }
};
