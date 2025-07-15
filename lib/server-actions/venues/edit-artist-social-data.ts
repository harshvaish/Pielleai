'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { venues } from '@/lib/database/schema';
import {
  venueS3FormSchema,
  VenueS3FormSchema,
} from '@/lib/validation/venueFormSchema';

export const editVenueSocialData = async ({
  venueId,
  data,
}: {
  venueId: number;
  data: VenueS3FormSchema;
}): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[editVenueSocialData] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[editVenueSocialData] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = venueS3FormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[editVenueSocialData] - Error: validation failed',
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
      .update(venues)
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
      .where(eq(venues.id, venueId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[editVenueSocialData] transaction failed', error);
    return {
      success: false,
      message: 'Aggiornamento scheda locale non riuscito.',
      data: null,
    };
  }
};
