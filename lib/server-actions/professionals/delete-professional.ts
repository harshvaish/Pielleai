'use server';

import { database } from '@/lib/database/connection';
import { professionals } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';
import { deleteProfessionalSchema } from '@/lib/validation/professional-schema';
import { AppError } from '@/lib/classes/AppError';
import { eq } from 'drizzle-orm';

export async function deleteProfessional(
  input: { professionalId: number },
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['admin'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = deleteProfessionalSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const result = await database
      .delete(professionals)
      .where(eq(professionals.id, validation.data.professionalId));

    if (result.rowCount === 0) {
      throw new AppError('Professionista non trovato.');
    }

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[deleteProfessional] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Eliminazione professionista non riuscita.',
      data: null,
    };
  }
}
