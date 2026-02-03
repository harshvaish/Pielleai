'use server';

import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { events, eventNotes } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

const accountingSchema = z.object({
  eventId: z.number().int().positive(),
  completed: z.boolean(),
});

export async function updateCancellationAccountingStatus(
  eventId: number,
  completed: boolean,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    const validation = accountingSchema.safeParse({ eventId, completed });
    if (!validation.success) {
      throw new AppError('Dati inviati non validi.');
    }

    const [eventRow] = await database
      .select({
        id: events.id,
        status: events.status,
        cancellationType: events.cancellationType,
        cancellationAt: events.cancellationAt,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!eventRow) {
      throw new AppError('Evento non trovato.');
    }

    if (!eventRow.cancellationAt) {
      throw new AppError('Evento non annullato.');
    }

    if (eventRow.cancellationType !== 'peaceful') {
      throw new AppError('Aggiornamento contabile disponibile solo per annullamenti pacifici.');
    }

    const now = new Date();
    const note = completed
      ? 'Storno fattura e aggiornamento contabile completati.'
      : 'Storno fattura e aggiornamento contabile riaperti.';

    await database.transaction(async (tx) => {
      await tx
        .update(events)
        .set({
          cancellationAccountingCompleted: completed,
          cancellationAccountingCompletedAt: completed ? now : null,
          updatedAt: now,
        })
        .where(eq(events.id, eventId));

      await tx.insert(eventNotes).values({
        writerId: user.id,
        eventId,
        content: note,
      });
    });

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[updateCancellationAccountingStatus] - Error:', error);
    return {
      success: false,
      message:
        error instanceof AppError
          ? error.message
          : 'Aggiornamento contabile non riuscito.',
      data: null,
    };
  }
}
