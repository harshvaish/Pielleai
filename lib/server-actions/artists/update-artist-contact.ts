'use server';

import { z } from 'zod/v4';
import { and, eq } from 'drizzle-orm';

import { database } from '@/lib/database/connection';
import { artistContacts } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';
import { AppError } from '@/lib/classes/AppError';
import { hasRole } from '@/lib/utils';
import type { ArtistContact, ServerActionResponse } from '@/lib/types';

const updateArtistContactSchema = z
  .object({
    artistId: z.number().int().positive(),
    contactId: z.number().int().positive(),
    name: z.string().trim().min(1).max(100).nullable(),
    phone: z.string().trim().min(1).max(50).nullable(),
    email: z.string().trim().email().nullable(),
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

const normalizeNullableString = (value?: string) => {
  const trimmed = value?.trim() || '';
  return trimmed.length ? trimmed : null;
};

export async function updateArtistContact(
  artistId: number,
  contactId: number,
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

    const validation = updateArtistContactSchema.safeParse({
      artistId,
      contactId,
      name: normalizeNullableString(payload.name),
      phone: normalizeNullableString(payload.phone),
      email: normalizeNullableString(payload.email),
    });

    if (!validation.success) {
      throw new AppError(validation.error.issues[0]?.message || 'I dati inviati non sono corretti.');
    }

    const now = new Date();
    const [updated] = await database
      .update(artistContacts)
      .set({
        name: validation.data.name,
        phone: validation.data.phone,
        email: validation.data.email,
        updatedAt: now,
      })
      .where(
        and(
          eq(artistContacts.id, validation.data.contactId),
          eq(artistContacts.artistId, validation.data.artistId),
        ),
      )
      .returning({
        id: artistContacts.id,
        artistId: artistContacts.artistId,
        name: artistContacts.name,
        phone: artistContacts.phone,
        email: artistContacts.email,
        createdAt: artistContacts.createdAt,
        updatedAt: artistContacts.updatedAt,
      });

    if (!updated) {
      throw new AppError('Contatto non trovato.');
    }

    return { success: true, message: null, data: updated as ArtistContact };
  } catch (error: any) {
    const message = error instanceof AppError ? error.message : 'Aggiornamento contatto non riuscito.';
    return { success: false, message, data: null };
  }
}

