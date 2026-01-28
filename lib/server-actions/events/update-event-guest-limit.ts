'use server';

import { z } from 'zod/v4';
import { database } from '@/lib/database/connection';
import { events } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';
import { AppError } from '@/lib/classes/AppError';
import { idValidation } from '@/lib/validation/_general';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

const updateGuestLimitSchema = z.object({
  eventId: idValidation,
  guestLimit: z
    .number({ invalid_type_error: 'Limite non valido.' })
    .int('Limite non valido.')
    .min(1, 'Il limite minimo e 1.')
    .max(500, 'Il limite massimo e 500.'),
});

export async function updateEventGuestLimit(
  input: { eventId: number; guestLimit: number },
): Promise<ServerActionResponse<{ guestLimit: number }>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['admin'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = updateGuestLimitSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const { eventId, guestLimit } = validation.data;

    const [updated] = await database
      .update(events)
      .set({ guestLimit, updatedAt: new Date() })
      .where(eq(events.id, eventId))
      .returning({ guestLimit: events.guestLimit });

    if (!updated) {
      throw new AppError('Evento non trovato.');
    }

    return { success: true, message: null, data: updated };
  } catch (error) {
    console.error('[updateEventGuestLimit] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento limite invitati non riuscito.',
      data: null,
    };
  }
}
