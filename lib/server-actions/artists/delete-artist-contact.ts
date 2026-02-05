'use server';

import { z } from 'zod/v4';
import { and, eq } from 'drizzle-orm';

import { database } from '@/lib/database/connection';
import { artistContacts } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';
import { AppError } from '@/lib/classes/AppError';
import { hasRole } from '@/lib/utils';
import type { ServerActionResponse } from '@/lib/types';

const deleteArtistContactSchema = z.object({
  artistId: z.number().int().positive(),
  contactId: z.number().int().positive(),
});

export async function deleteArtistContact(
  artistId: number,
  contactId: number,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      throw new AppError('Non sei autorizzato.');
    }

    const validation = deleteArtistContactSchema.safeParse({ artistId, contactId });
    if (!validation.success) {
      throw new AppError(validation.error.issues[0]?.message || 'I dati inviati non sono corretti.');
    }

    const [deleted] = await database
      .delete(artistContacts)
      .where(
        and(
          eq(artistContacts.id, validation.data.contactId),
          eq(artistContacts.artistId, validation.data.artistId),
        ),
      )
      .returning({ id: artistContacts.id });

    if (!deleted) {
      throw new AppError('Contatto non trovato.');
    }

    return { success: true, message: null, data: null };
  } catch (error: any) {
    const message = error instanceof AppError ? error.message : 'Eliminazione contatto non riuscita.';
    return { success: false, message, data: null };
  }
}

