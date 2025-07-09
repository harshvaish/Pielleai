'use server';

import { database } from '@/lib/database/connection';
import { profileNotes } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function deleteProfileNote(
  noteId: number
): Promise<ServerActionResponse<null>> {
  try {
    await database.delete(profileNotes).where(eq(profileNotes.id, noteId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (err) {
    console.error('[deleteProfileNote] - Error deleting note:', err);
    return {
      success: false,
      message: 'Eliminazione nota non riuscita.',
      data: null,
    };
  }
}
