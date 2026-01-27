'use server';

import { database } from '@/lib/database/connection';
import { eventProfessionals } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';
import { updateEventProfessionalsSchema } from '@/lib/validation/professional-schema';
import { AppError } from '@/lib/classes/AppError';
import { eq } from 'drizzle-orm';

export async function updateEventProfessionals(
  input: { eventId: number; professionalIds: number[] },
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['admin'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = updateEventProfessionalsSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const { eventId, professionalIds } = validation.data;

    await database.transaction(async (tx) => {
      await tx.delete(eventProfessionals).where(eq(eventProfessionals.eventId, eventId));

      if (professionalIds.length > 0) {
        await tx.insert(eventProfessionals).values(
          professionalIds.map((professionalId) => ({
            eventId,
            professionalId,
          })),
        );
      }
    });

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[updateEventProfessionals] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento professionisti non riuscito.',
      data: null,
    };
  }
}
