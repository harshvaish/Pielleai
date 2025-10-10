'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, events } from '@/lib/database/schema';
import { EventStatus, ServerActionResponse } from '@/lib/types';
import { hasRole } from '@/lib/utils';
import { eventStatusEnumValidation, idValidation } from '@/lib/validation/_general';
import { isBefore } from 'date-fns';
import { and, eq, ne, count, inArray } from 'drizzle-orm';
import { z } from 'zod/v4';

export async function updateEventStatus(
  eventId: number,
  newStatus: EventStatus,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateEventStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager', 'venue-manager'])) {
      console.error('[updateEventStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      eventId: idValidation,
      newStatus: eventStatusEnumValidation,
    });

    const validation = schema.safeParse({ eventId, newStatus });

    if (!validation.success) {
      console.error('[updateEventStatus] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const now = new Date();

    // Fetch event + availability
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
    if (isBefore(oldEvent.availability.endDate, now)) throw new AppError('Evento scaduto.');

    // Block activating on a booked availability
    if (
      ['confirmed', 'proposed', 'pre-confirmed'].includes(newStatus) &&
      oldEvent.availability.status === 'booked' &&
      oldEvent.status !== 'confirmed'
    ) {
      throw new AppError('Questa disponibilità è già prenotata da un evento confermato.');
    }

    if (oldEvent.status !== newStatus) {
      // If confirming, friendly pre-check (DB index will enforce anyway)
      if (newStatus === 'confirmed') {
        const [alreadyConfirmed] = await database
          .select({ count: count() })
          .from(events)
          .where(
            and(
              ne(events.id, eventId),
              eq(events.availabilityId, oldEvent.availability.id),
              eq(events.status, 'confirmed'),
            ),
          )
          .limit(1);

        if (alreadyConfirmed.count > 0) {
          throw new AppError('Un altro evento è già confermato per questa disponibilità.');
        }
      }
    }

    await database.transaction(async (tx) => {
      // STEP 1: HANDLE AVAILABILITY --------------------------------------------------------
      if (newStatus === 'confirmed' && oldEvent.availability.status !== 'booked') {
        await tx
          .update(artistAvailabilities)
          .set({ status: 'booked', updatedAt: now })
          .where(eq(artistAvailabilities.id, oldEvent.availability.id));
      }

      // STEP 2: HANDLE EVENT --------------------------------------------------------
      await tx
        .update(events)
        .set({ status: newStatus, updatedAt: now })
        .where(eq(events.id, eventId));

      // STEP 3: HANDLE CONFLICTS --------------------------------------------------------
      if (['proposed', 'pre-confirmed', 'confirmed', 'conflict'].includes(newStatus)) {
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

        if (conflictEvents.length > 0) {
          if (newStatus === 'confirmed') {
            for (const conflictEvent of conflictEvents) {
              await tx
                .update(events)
                .set({ status: 'rejected', previousStatus: events.status, updatedAt: now })
                .where(eq(events.id, conflictEvent.id));
            }
          } else {
            conflictEvents.push({ id: eventId, status: newStatus });

            for (const conflictEvent of conflictEvents) {
              if (conflictEvent.status != 'conflict') {
                await tx
                  .update(events)
                  .set({ status: 'conflict', previousStatus: events.status, updatedAt: now })
                  .where(eq(events.id, conflictEvent.id));
              }
            }
          }
        }
      }
    });

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[updateEventStatus] - Error:', error);
    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Aggiornamento stato evento non riuscito.',
      data: null,
    };
  }
}
