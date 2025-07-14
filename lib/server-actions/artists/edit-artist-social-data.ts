'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { artists } from '@/lib/database/schema';
import {
  artistS3FormSchema,
  ArtistS3FormSchema,
} from '@/lib/validation/artistFormSchema';

export const editArtistSocialData = async ({
  artistId,
  data,
}: {
  artistId: number;
  data: ArtistS3FormSchema;
}): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[editArtistSocialData] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[editArtistSocialData] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = artistS3FormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[editArtistSocialData] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  try {
    await database
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
      .where(eq(artists.id, artistId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[editArtistSocialData] transaction failed', error);
    return {
      success: false,
      message: 'Aggiornamento profilo non riuscito.',
      data: null,
    };
  }
};
