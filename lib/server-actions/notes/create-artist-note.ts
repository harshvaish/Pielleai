'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { artistNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { newNoteSchema } from '@/lib/validation/newNoteSchema';
import { headers } from 'next/headers';

export async function createArtistNote(writerId: string, artistId: number, content: string): Promise<ServerActionResponse<ProfileNote | null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
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
