'use server';

import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { artistBlacklistedAreas } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { idValidation } from '@/lib/validation/_general';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import { ensureArtistBlacklistAccess } from './ensure-artist-blacklist-access';

export const removeArtistBlacklistedArea = async (
  artistId: number,
  blacklistId: number,
): Promise<ServerActionResponse<null>> => {
  try {
    await ensureArtistBlacklistAccess(artistId);

    const schema = z.object({
      artistId: idValidation,
      blacklistId: idValidation,
    });

    const validation = schema.safeParse({ artistId, blacklistId });

    if (!validation.success) {
      console.error(
        '[removeArtistBlacklistedArea] - Error: validation failed - ',
        validation.error.issues[0],
      );
      throw new AppError('Dati inviati non corretti.');
    }

    const result = await database
      .delete(artistBlacklistedAreas)
      .where(
        and(
          eq(artistBlacklistedAreas.id, validation.data.blacklistId),
          eq(artistBlacklistedAreas.artistId, validation.data.artistId),
        ),
      );

    if (!result.rowCount) {
      throw new AppError('Elemento non trovato.');
    }

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[removeArtistBlacklistedArea] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Rimozione blacklist non riuscita.',
      data: null,
    };
  }
};
