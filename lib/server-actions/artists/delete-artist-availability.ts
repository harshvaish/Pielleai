'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, events } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { hasRole } from '@/lib/utils';
import { idValidation } from '@/lib/validation/_general';
import { eq, inArray } from 'drizzle-orm';

export async function deleteArtistAvailability(
  availabilityId: number,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[deleteArtistAvailability] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      console.error('[deleteArtistAvailability] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = idValidation.safeParse(availabilityId);
    if (!validation.success) {
      console.error('[deleteArtistAvailability] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    return await database.transaction(async (tx) => {
      // Ensure the availability exists
      const availability = await tx
        .select({
          id: artistAvailabilities.id,
          status: artistAvailabilities.status,
        })
        .from(artistAvailabilities)
        .where(eq(artistAvailabilities.id, availabilityId));

      const found = availability[0];
      if (!found) {
        throw new AppError('Disponibilità non trovata.');
      }

      // Block delete if availability is booked
      if (found.status === 'booked') {
        throw new AppError('Disponibilità prenotata.');
      }

      // Load events attached to this availability
      const eventsAttached = await tx
        .select({
          id: events.id,
          status: events.status,
          previousStatus: events.previousStatus,
        })
        .from(events)
        .where(eq(events.availabilityId, availabilityId));

      // Block delete if any protected event is present
      const hasProtected = eventsAttached.some(
        (e) =>
          e.status === 'pre-confirmed' ||
          e.status === 'confirmed' ||
          e.previousStatus === 'pre-confirmed',
      );
      if (hasProtected) {
        throw new AppError('Disponibilità collegata ad un evento approvato.');
      }

      // Delete dependent events first (if any), then the availability
      const deletableEventIds = eventsAttached.map((e) => e.id);
      if (deletableEventIds.length > 0) {
        await tx.delete(events).where(inArray(events.id, deletableEventIds));
      }

      await tx.delete(artistAvailabilities).where(eq(artistAvailabilities.id, availabilityId));

      return {
        success: true,
        message: null,
        data: null,
      };
    });
  } catch (error) {
    console.error('[deleteArtistAvailability] transaction failed:', error);

    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Cancellazione disponibilità non riuscita.',
      data: null,
    };
  }
}
