'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { profileNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { newNoteSchema } from '@/lib/validation/new-note-schema';

export async function createProfileNote(
  writerId: string,
  receiverProfileId: number,
  content: string,
): Promise<ServerActionResponse<ProfileNote | null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createProfileNote] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      console.error('[createProfileNote] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = newNoteSchema.safeParse({
      writerId,
      receiverId: receiverProfileId,
      content,
    });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

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
  } catch (error) {
    console.error('[createProfileNote] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Inserimento nota non riuscito.',
      data: null,
    };
  }
}
