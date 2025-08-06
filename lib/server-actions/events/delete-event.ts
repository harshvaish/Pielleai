'use server';

import { auth } from '@/lib/auth';
import { database } from '@/lib/database/connection';
import { events, artistAvailabilities } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq, and, count } from 'drizzle-orm';
import { headers } from 'next/headers';
import { AppError } from '@/lib/classes/AppError';

export async function deleteEvent(eventId: number): Promise<ServerActionResponse<null>> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user || session.user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    await database.transaction(async (tx) => {
      // 1. Get the event with its availability ID and status
      const [event] = await tx
        .select({
          id: events.id,
          status: events.status,
          availabilityId: events.availabilityId,
        })
        .from(events)
        .where(eq(events.id, eventId))
        .limit(1);

      if (!event) throw new AppError('Evento non trovato.');

      const availabilityId = event.availabilityId;

      // 2. Delete the event
      await tx.delete(events).where(eq(events.id, eventId));

      // 3. Check if any confirmed events remain for this availability
      const confirmedCount = await tx
        .select({ count: count() })
        .from(events)
        .where(and(eq(events.availabilityId, availabilityId), eq(events.status, 'confirmed')));

      const [availability] = await tx
        .select({
          endDate: artistAvailabilities.endDate,
        })
        .from(artistAvailabilities)
        .where(eq(artistAvailabilities.id, availabilityId))
        .limit(1);

      if (!availability) throw new AppError('Disponibilità non trovata.');

      const now = new Date();
      const isExpired = availability.endDate < now;

      if (confirmedCount[0].count === 0 && !isExpired) {
        await tx.update(artistAvailabilities).set({ status: 'available', updatedAt: now }).where(eq(artistAvailabilities.id, availabilityId));
      }
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[deleteEvent] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Cancellazione evento non riuscita.',
      data: null,
    };
  }
}
