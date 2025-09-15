'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { artistNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { newNoteSchema } from '@/lib/validation/new-note-schema';

export async function createArtistNote(
  writerId: string,
  artistId: number,
  content: string,
): Promise<ServerActionResponse<ProfileNote | null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createArtistNote] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      console.error('[createArtistNote] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = newNoteSchema.safeParse({ writerId, receiverId: artistId, content });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

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
  } catch (error) {
    console.error('[createArtistNote] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Inserimento nota non riuscito.',
      data: null,
    };
  }
}
