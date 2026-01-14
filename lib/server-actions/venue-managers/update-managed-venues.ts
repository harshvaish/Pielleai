'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq, inArray } from 'drizzle-orm';
import { profiles, users, venues } from '@/lib/database/schema';
import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import { idValidation } from '@/lib/validation/_general';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const updateManagedVenues = async (
  managerProfileId: number,
  venueIds: number[],
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateManagedVenues] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    const schema = z.object({
      managerProfileId: idValidation,
      venueIds: z.array(idValidation).optional(),
    });

    const validation = schema.safeParse({ managerProfileId, venueIds });
    if (!validation.success) {
      console.error('[updateManagedVenues] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('Dati inviati non corretti.');
    }

    if (user.role !== 'admin') {
      const userProfileIdCheck = await getUserProfileIdCached(user.id);
      if (!userProfileIdCheck || userProfileIdCheck !== validation.data.managerProfileId) {
        console.error('[updateManagedVenues] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
    }

    const manager = await database
      .select({ userId: profiles.userId })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(and(eq(profiles.id, validation.data.managerProfileId), eq(users.role, 'venue-manager')))
      .limit(1);

    if (!manager.length) {
      throw new AppError('Promoter non valido.');
    }

    const safeVenueIds = [...new Set(validation.data.venueIds ?? [])];

    const selectedVenues =
      safeVenueIds.length > 0
        ? await database
            .select({ id: venues.id, managerProfileId: venues.managerProfileId, slug: venues.slug })
            .from(venues)
            .where(inArray(venues.id, safeVenueIds))
        : [];

    if (selectedVenues.length !== safeVenueIds.length) {
      throw new AppError('Uno o più locali selezionati non validi.');
    }

    if (user.role !== 'admin') {
      const invalidVenues = selectedVenues.filter(
        (venue) => venue.managerProfileId && venue.managerProfileId !== validation.data.managerProfileId,
      );

      if (invalidVenues.length > 0) {
        throw new AppError('Uno o più locali non sono disponibili per l’associazione.');
      }
    }

    const existingVenues = await database
      .select({ id: venues.id, slug: venues.slug })
      .from(venues)
      .where(eq(venues.managerProfileId, validation.data.managerProfileId));

    const existingVenueIds = new Set(existingVenues.map((venue) => venue.id));
    const selectedVenueIds = new Set(safeVenueIds);

    const venuesToRemove = [...existingVenueIds].filter((id) => !selectedVenueIds.has(id));

    await database.transaction(async (tx) => {
      if (safeVenueIds.length > 0) {
        await tx
          .update(venues)
          .set({ managerProfileId: validation.data.managerProfileId, updatedAt: new Date() })
          .where(inArray(venues.id, safeVenueIds));
      }

      if (venuesToRemove.length > 0) {
        await tx
          .update(venues)
          .set({ managerProfileId: null, updatedAt: new Date() })
          .where(inArray(venues.id, venuesToRemove));
      }
    });

    revalidateTag(`venue-manager:${manager[0].userId}`, 'max');
    revalidateTag('venues', 'max');

    const slugsToRevalidate = new Set([
      ...existingVenues.map((venue) => venue.slug),
      ...selectedVenues.map((venue) => venue.slug),
    ]);

    slugsToRevalidate.forEach((slug) => {
      revalidateTag(`venue:${slug}`, 'max');
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateManagedVenues] transaction failed:', error);

    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Aggiornamento locali gestiti non riuscito.',
      data: null,
    };
  }
};
