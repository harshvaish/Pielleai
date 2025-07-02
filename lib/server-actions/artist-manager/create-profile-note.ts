'use server';

import { database } from '@/lib/database/connection';
import { profileNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { newNoteSchema } from '@/lib/validation/newNoteSchema';

export async function createProfileNote({
  writerId,
  receiverProfileId,
  content,
}: {
  writerId: string;
  receiverProfileId: number;
  content: string;
}): Promise<ServerActionResponse<ProfileNote | null>> {
  const validation = newNoteSchema.safeParse(content);

  if (!validation.success) {
    return {
      success: false,
      message: 'Contenuto nota non valido.',
      data: null,
    };
  }
  try {
    const newNote = await database
      .insert(profileNotes)
      .values({
        writerId: writerId,
        receiverProfileId: receiverProfileId,
        content: content,
      })
      .returning({
        id: profileNotes.id,
        content: profileNotes.content,
        createdAt: profileNotes.createdAt,
      });

    return {
      success: true,
      message: null,
      data: newNote[0],
    };
  } catch (err) {
    console.error('[updateUserNote] - Error updating note:', err);
    return {
      success: false,
      message: 'Inserimento nota non riuscito.',
      data: null,
    };
  }
}
