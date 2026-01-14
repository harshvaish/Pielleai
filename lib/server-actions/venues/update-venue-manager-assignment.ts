'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { profiles, users, venues } from '@/lib/database/schema';
import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import { idValidation } from '@/lib/validation/_general';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const updateVenueManagerAssignment = async (
  venueId: number,
  managerProfileId: number | null,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateVenueManagerAssignment] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      console.error('[updateVenueManagerAssignment] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      venueId: idValidation,
      managerProfileId: idValidation.nullable(),
    });

    const validation = schema.safeParse({ venueId, managerProfileId });
    if (!validation.success) {
      console.error(
        '[updateVenueManagerAssignment] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('Dati inviati non corretti.');
    }

    const [venue] = await database
      .select({ id: venues.id, slug: venues.slug, managerProfileId: venues.managerProfileId })
      .from(venues)
      .where(eq(venues.id, validation.data.venueId))
      .limit(1);

    if (!venue) {
      throw new AppError('Locale non trovato.');
    }

    let newManagerUserId: string | null = null;
    let previousManagerUserId: string | null = null;

    if (validation.data.managerProfileId) {
      const manager = await database
        .select({ userId: profiles.userId })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(
          and(eq(profiles.id, validation.data.managerProfileId), eq(users.role, 'venue-manager')),
        )
        .limit(1);

      if (!manager.length) {
        throw new AppError('Promoter non valido.');
      }

      newManagerUserId = manager[0].userId;
    }

    if (venue.managerProfileId) {
      const previousManager = await database
        .select({ userId: profiles.userId })
        .from(profiles)
        .where(eq(profiles.id, venue.managerProfileId))
        .limit(1);

      previousManagerUserId = previousManager[0]?.userId ?? null;
    }

    await database
      .update(venues)
      .set({ managerProfileId: validation.data.managerProfileId, updatedAt: new Date() })
      .where(eq(venues.id, validation.data.venueId));

    revalidateTag(`venue:${venue.slug}`, 'max');
    revalidateTag('venues', 'max');

    if (previousManagerUserId) {
      revalidateTag(`venue-manager:${previousManagerUserId}`, 'max');
    }
    if (newManagerUserId && newManagerUserId !== previousManagerUserId) {
      revalidateTag(`venue-manager:${newManagerUserId}`, 'max');
    }

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateVenueManagerAssignment] transaction failed:', error);

    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Aggiornamento promoter non riuscito.',
      data: null,
    };
  }
};
