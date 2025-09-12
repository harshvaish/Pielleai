'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, events, eventStatus } from '@/lib/database/schema';
import { EventStatus, ServerActionResponse } from '@/lib/types';
import { hasRole } from '@/lib/utils';
import { idValidation } from '@/lib/validation/_general';
import { and, eq, ne, count } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod/v4';

export async function updateEventStatus(
  eventId: number,
  newStatus: EventStatus,
): Promise<ServerActionResponse<null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || !hasRole(session.user, ['admin', 'artist-manager'])) {
      console.error('[updateEventStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      eventId: idValidation,
      newStatus: z.enum(eventStatus.enumValues, "Seleziona un'opzione valida."),
    });

    const validation = schema.safeParse({ eventId, newStatus });

    if (!validation.success) {
      console.error('[updateEventStatus] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const now = new Date();

    // Fetch event + availability
    const [currentEvent] = await database
      .select({
        id: events.id,
        status: events.status,
        availabilityId: events.availabilityId,
        endDate: artistAvailabilities.endDate,
        availabilityStatus: artistAvailabilities.status,
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .where(eq(events.id, eventId))
      .limit(1);

    if (!currentEvent) throw new AppError('Evento non trovato.');
    if (new Date(currentEvent.endDate) < now) throw new AppError('Evento scaduto.');

    // Block activating on a booked availability
    if (
      ['confirmed', 'proposed', 'pre-confirmed'].includes(newStatus) &&
      currentEvent.availabilityStatus === 'booked' &&
      currentEvent.status !== 'confirmed'
    ) {
      throw new AppError('Questa disponibilità è già prenotata da un evento confermato.');
    }

    if (currentEvent.status !== newStatus) {
      // Users must not set 'conflict' directly; it's system-managed
      if (newStatus === 'conflict') {
        throw new AppError("Lo stato 'conflitto' è gestito automaticamente dal sistema.");
      }

      // If confirming, friendly pre-check (DB index will enforce anyway)
      if (newStatus === 'confirmed') {
        const [alreadyConfirmed] = await database
          .select({ count: count() })
          .from(events)
          .where(
            and(
              eq(events.availabilityId, currentEvent.availabilityId),
              eq(events.status, 'confirmed'),
              ne(events.id, eventId),
            ),
          )
          .limit(1);

        if (alreadyConfirmed.count > 0) {
          throw new AppError('Un altro evento è già confermato per questa disponibilità.');
        }
      }
    }

    // Perform the status update — triggers will handle booking & conflicts
    await database
      .update(events)
      .set({ status: newStatus, previousStatus: events.status, updatedAt: now })
      .where(eq(events.id, eventId));

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
