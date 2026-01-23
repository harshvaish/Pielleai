'use server';

import { z } from 'zod/v4';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { database } from '@/lib/database/connection';
import { artists } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';
import { AppError } from '@/lib/classes/AppError';
import { hasRole } from '@/lib/utils';
import { ServerActionResponse } from '@/lib/types';

const artistDocumentsSchema = z.object({
  artistId: z.number().int().positive(),
  type: z.enum(['tax-code', 'id-card', 'passport']),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
});

export const updateArtistDocuments = async (
  artistId: number,
  payload: { type: 'tax-code' | 'id-card' | 'passport'; fileName: string; fileUrl: string },
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      throw new AppError('Non sei autorizzato.');
    }

    const validation = artistDocumentsSchema.safeParse({
      artistId,
      ...payload,
    });

    if (!validation.success) {
      throw new AppError('I dati inviati non sono corretti.');
    }

    const updates =
      validation.data.type === 'tax-code'
        ? {
            taxCodeFileUrl: validation.data.fileUrl,
            taxCodeFileName: validation.data.fileName,
          }
        : validation.data.type === 'id-card'
          ? {
              idCardFileUrl: validation.data.fileUrl,
              idCardFileName: validation.data.fileName,
            }
          : {
              passportFileUrl: validation.data.fileUrl,
              passportFileName: validation.data.fileName,
            };

    const updated = await database
      .update(artists)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(artists.id, artistId))
      .returning({ slug: artists.slug });

    const slug = updated[0]?.slug;
    if (slug) revalidateTag(`artist:${slug}`, 'max');
    revalidateTag('artists', 'max');

    return { success: true, message: null, data: null };
  } catch (error: any) {
    const message = error instanceof AppError ? error.message : 'Aggiornamento non riuscito.';
    return { success: false, message, data: null };
  }
};
