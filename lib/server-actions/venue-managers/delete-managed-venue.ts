'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { venues } from '@/lib/database/schema';
import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import { idValidation } from '@/lib/validation/_general';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { revalidateTag } from 'next/cache';

export const deleteManagedVenue = async (
  managerProfileId: number,
  venueId: number,
): Promise<ServerActionResponse<null>> => {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      console.error('[deleteManagedVenue] - Error: unauthenticated', session);
      throw new AppError('Non sei autenticato.');
    }

    if (session.user.role != 'admin') {
      const userProfileIdCheck = await getUserProfileIdCached(session.user.id);
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

    revalidateTag(`profile:${session.user.id}`);
    revalidateTag(`venue-manager:${session.user.id}`);

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
