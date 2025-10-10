'use server';

import { AppError } from '@/lib/classes/AppError';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, events } from '@/lib/database/schema';
import { and, eq, inArray, ne } from 'drizzle-orm';
import { idValidation } from '@/lib/validation/_general';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';

export async function deleteEvent(eventId: number): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[deleteEvent] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'venue-manager'])) {
      console.error('[deleteEvent] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = idValidation.safeParse(eventId);

    if (!validation.success) {
      console.error('[deleteEvent] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const now = new Date();

    // get old event
    const [oldEvent] = await database
      .select({
        id: events.id,
        status: events.status,
        availability: {
          id: artistAvailabilities.id,
          status: artistAvailabilities.status,
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
        },
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .where(eq(events.id, eventId))
      .limit(1);

    if (!oldEvent) throw new AppError('Evento non trovato.');

    await database.transaction(async (tx) => {
      // STEP 1: HANDLE AVAILABILITY --------------------------------------------------------
      if (oldEvent.status === 'confirmed' && oldEvent.availability.status === 'booked') {
        await tx
          .update(artistAvailabilities)
          .set({ status: 'available', updatedAt: now })
          .where(eq(artistAvailabilities.id, oldEvent.availability.id));
      }

      // STEP 2: HANDLE EVENT --------------------------------------------------------
      await database.delete(events).where(eq(events.id, eventId));

      // STEP 3: HANDLE CONFLICTS --------------------------------------------------------
      if (oldEvent.status === 'conflict') {
        const conflictEvents = await tx
          .select({
            id: events.id,
            status: events.status,
          })
          .from(events)
          .where(
            and(
              ne(events.id, eventId),
              eq(events.availabilityId, oldEvent.availability.id),
              inArray(events.status, ['proposed', 'pre-confirmed', 'conflict']),
            ),
          );

        if (conflictEvents.length === 1) {
          if (conflictEvents[0].status === 'conflict') {
            await tx
              .update(events)
              .set({ status: events.previousStatus, previousStatus: null, updatedAt: now })
              .where(eq(events.id, conflictEvents[0].id));
          }
        }
      }
    });

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[deleteEvent] error:', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Cancellazione evento non riuscita.',
      data: null,
    };
  }
}
