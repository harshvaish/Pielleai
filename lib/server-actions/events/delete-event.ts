'use server';

import { AppError } from '@/lib/classes/AppError';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { events } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
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

    await database.delete(events).where(eq(events.id, eventId));
    // No other logic here—DB trigger handles conflicts & availability status.

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
