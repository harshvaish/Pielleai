'use server';

import { z } from 'zod/v4';

import { database } from '@/lib/database/connection';
import { artistContacts } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';
import { AppError } from '@/lib/classes/AppError';
import { hasRole } from '@/lib/utils';
import type { ArtistContact, ServerActionResponse } from '@/lib/types';

const artistContactSchema = z
  .object({
    artistId: z.number().int().positive(),
    name: z.string().trim().min(1).max(100).optional(),
    phone: z.string().trim().min(1).max(50).optional(),
    email: z.string().trim().email().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.name && !data.phone && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Inserisci almeno un dato di contatto.',
        path: ['name'],
      });
    }
  });

export async function createArtistContact(
  artistId: number,
  payload: { name?: string; phone?: string; email?: string },
): Promise<ServerActionResponse<ArtistContact>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      throw new AppError('Non sei autorizzato.');
    }

    const now = new Date();
    const validation = artistContactSchema.safeParse({
      artistId,
      name: payload.name?.trim() || undefined,
      phone: payload.phone?.trim() || undefined,
      email: payload.email?.trim() || undefined,
    });

    if (!validation.success) {
      throw new AppError(validation.error.issues[0]?.message || 'I dati inviati non sono corretti.');
    }

    const [created] = await database
      .insert(artistContacts)
      .values({
        artistId: validation.data.artistId,
        name: validation.data.name ?? null,
        phone: validation.data.phone ?? null,
        email: validation.data.email ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        id: artistContacts.id,
        artistId: artistContacts.artistId,
        name: artistContacts.name,
        phone: artistContacts.phone,
        email: artistContacts.email,
        createdAt: artistContacts.createdAt,
        updatedAt: artistContacts.updatedAt,
      });

    if (!created) {
      throw new AppError('Creazione contatto non riuscita.');
    }

    return { success: true, message: null, data: created as ArtistContact };
  } catch (error: any) {
    const message = error instanceof AppError ? error.message : 'Creazione contatto non riuscita.';
    return { success: false, message, data: null };
  }
}

