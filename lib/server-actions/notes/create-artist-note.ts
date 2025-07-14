'use server';

import { database } from '@/lib/database/connection';
import { artistNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { newNoteSchema } from '@/lib/validation/newNoteSchema';

export async function createArtistNote({
  writerId,
  artistId,
  content,
}: {
  writerId: string;
  artistId: number;
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
      .insert(artistNotes)
      .values({
        writerId: writerId,
        artistId: artistId,
        content: content,
      })
      .returning({
        id: artistNotes.id,
        content: artistNotes.content,
        createdAt: artistNotes.createdAt,
      });

    return {
      success: true,
      message: null,
      data: newNote[0],
    };
  } catch (err) {
    console.error('[createArtistNote] - Error inserting note:', err);
    return {
      success: false,
      message: 'Inserimento nota non riuscito.',
      data: null,
    };
  }
}
