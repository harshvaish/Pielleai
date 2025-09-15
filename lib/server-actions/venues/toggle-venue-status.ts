'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { venues } from '@/lib/database/schema';
import { ServerActionResponse, UserStatus } from '@/lib/types';
import { hasRole } from '@/lib/utils';
import { idValidation, userStatusEnumValidation } from '@/lib/validation/_general';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod/v4';

export async function toggleVenueStatus(
  venueId: number,
  initialStatus: UserStatus,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[toggleVenueStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'venue-manager'])) {
      console.error('[toggleVenueStatus] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      venueId: idValidation,
      initialStatus: userStatusEnumValidation,
    });

    const validation = schema.safeParse({ venueId, initialStatus });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const newStatus: UserStatus = initialStatus === 'active' ? 'disabled' : 'active';

    const updateResult = await database
      .update(venues)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(venues.id, venueId))
      .returning({ slug: venues.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`);
    revalidateTag('venues');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[toggleVenueStatus] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento locale non riuscito.',
      data: null,
    };
  }
}
