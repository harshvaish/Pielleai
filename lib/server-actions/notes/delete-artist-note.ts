'use server';

import { database } from '@/lib/database/connection';
import { artistNotes } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function deleteArtistNote(
  noteId: number
): Promise<ServerActionResponse<null>> {
  try {
    await database.delete(artistNotes).where(eq(artistNotes.id, noteId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (err) {
    console.error('[deleteArtistNote] - Error deleting note:', err);
    return {
      success: false,
      message: 'Eliminazione nota non riuscita.',
      data: null,
    };
  }
}
