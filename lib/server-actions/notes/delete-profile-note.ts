'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { profileNotes } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { idValidation } from '@/lib/validation/_general';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function deleteProfileNote(noteId: number): Promise<ServerActionResponse<null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[deleteProfileNote] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = idValidation.safeParse(noteId);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const result = await database.delete(profileNotes).where(eq(profileNotes.id, noteId));

    const deletedRows = result.rowCount;

    if (!deletedRows) {
      throw new AppError('Nota non trovata.');
    }

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[deleteProfileNote] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Eliminazione nota non riuscita.',
      data: null,
    };
  }
}
