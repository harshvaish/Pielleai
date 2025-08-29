'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { profileNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { newNoteSchema } from '@/lib/validation/new-note-schema';
import { headers } from 'next/headers';

export async function createProfileNote(
  writerId: string,
  receiverProfileId: number,
  content: string,
): Promise<ServerActionResponse<ProfileNote | null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
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
