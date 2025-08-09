'use server';

import { AppError } from '@/lib/classes/AppError';
import { EventStatus } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, events } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { and, eq, ne, count } from 'drizzle-orm';

export async function updateEventStatus(eventId: number, newStatus: EventStatus): Promise<ServerActionResponse<null>> {
  try {
    const now = new Date();

    // 1) Fetch event + availability
    const [event] = await database
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

    if (!event) throw new AppError('Evento non trovato.');
    if (event.endDate < now) throw new AppError('Evento scaduto.');

    // 2) Users must not set 'conflict' directly; it's system-managed
    if (newStatus === 'conflict') {
      throw new AppError("Lo stato 'conflitto' è gestito automaticamente dal sistema.");
    }

    // 3) If confirming, friendly pre-check (DB index will enforce anyway)
    if (newStatus === 'confirmed') {
      const [alreadyConfirmed] = await database
        .select({ count: count() })
        .from(events)
        .where(and(eq(events.availabilityId, event.availabilityId), eq(events.status, 'confirmed'), ne(events.id, eventId)))
        .limit(1);

      if (alreadyConfirmed.count > 0) {
        throw new AppError('Un altro evento è già confermato per questa disponibilità.');
      }
    }

    // 4) block activating on a booked availability
    if (['confirmed', 'proposed', 'pre-confirmed'].includes(newStatus) && event.availabilityStatus === 'booked' && event.status !== 'confirmed') {
      throw new AppError('Questa disponibilità è già prenotata da un evento confermato.');
    }

    // 5) Perform the status update — triggers will handle booking & conflicts
    await database.update(events).set({ status: newStatus, updatedAt: now }).where(eq(events.id, eventId));

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[updateEventStatus] - Error:', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento stato evento non riuscito.',
      data: null,
    };
  }
}
