'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { venues } from '@/lib/database/schema';
import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import { idValidation } from '@/lib/validation/_general';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const deleteManagedVenue = async (
  managerProfileId: number,
  venueId: number,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[deleteManagedVenue] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      const userProfileIdCheck = await getUserProfileIdCached(user.id);
      if (!userProfileIdCheck || userProfileIdCheck != managerProfileId) {
        console.error('[deleteManagedVenue] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
    }

    const schema = z.object({
      managerProfileId: idValidation,
      venueId: idValidation,
    });

    const validation = schema.safeParse({ managerProfileId, venueId });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const result = await database
      .delete(venues)
      .where(and(eq(venues.managerProfileId, managerProfileId), eq(venues.id, venueId)));

    const deletedRows = result.rowCount;

    if (!deletedRows) {
      throw new AppError('Locale non trovato.');
    }

    revalidateTag(`profile:${user.id}`);
    revalidateTag(`venue-manager:${user.id}`);

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[deleteManagedVenue] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Rimozione locale non riuscita.',
      data: null,
    };
  }
};
