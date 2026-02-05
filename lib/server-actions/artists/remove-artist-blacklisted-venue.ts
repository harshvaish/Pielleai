'use server';

import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { artistBlacklistedVenues } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { idValidation } from '@/lib/validation/_general';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import { ensureArtistBlacklistAccess } from './ensure-artist-blacklist-access';

export const removeArtistBlacklistedVenue = async (
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
        '[removeArtistBlacklistedVenue] - Error: validation failed - ',
        validation.error.issues[0],
      );
      throw new AppError('Dati inviati non corretti.');
    }

    const result = await database
      .delete(artistBlacklistedVenues)
      .where(
        and(
          eq(artistBlacklistedVenues.id, validation.data.blacklistId),
          eq(artistBlacklistedVenues.artistId, validation.data.artistId),
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
    console.error('[removeArtistBlacklistedVenue] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Rimozione blacklist non riuscita.',
      data: null,
    };
  }
};
