'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { artists } from '@/lib/database/schema';
import { artistS3FormSchema, ArtistS3FormSchema } from '@/lib/validation/artist-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { hasRole } from '@/lib/utils';
import getSession from '@/lib/data/auth/get-session';

export const updateArtistSocialData = async (
  artistId: number,
  data: ArtistS3FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateArtistSocialData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      console.error('[updateArtistSocialData] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = artistS3FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateArtistSocialData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const updateResult = await database
      .update(artists)
      .set({
        tiktokUrl: validation.data.tiktokUrl,
        tiktokUsername: validation.data.tiktokUsername,
        tiktokFollowers: validation.data.tiktokFollowers,
        tiktokCreatedAt: validation.data.tiktokCreatedAt,

        facebookUrl: validation.data.facebookUrl,
        facebookUsername: validation.data.facebookUsername,
        facebookFollowers: validation.data.facebookFollowers,
        facebookCreatedAt: validation.data.facebookCreatedAt,

        instagramUrl: validation.data.instagramUrl,
        instagramUsername: validation.data.instagramUsername,
        instagramFollowers: validation.data.instagramFollowers,
        instagramCreatedAt: validation.data.instagramCreatedAt,

        xUrl: validation.data.xUrl,
        xUsername: validation.data.xUsername,
        xFollowers: validation.data.xFollowers,
        xCreatedAt: validation.data.xCreatedAt,

        updatedAt: new Date(),
      })
      .where(eq(artists.id, artistId))
      .returning({ slug: artists.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`artist:${slug}`);
    revalidateTag('artists');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateArtistSocialData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento profilo non riuscito.',
      data: null,
    };
  }
};
