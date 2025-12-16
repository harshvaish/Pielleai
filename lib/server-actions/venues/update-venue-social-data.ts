'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { venues } from '@/lib/database/schema';
import { venueS3FormSchema, VenueS3FormSchema } from '@/lib/validation/venue-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { hasRole } from '@/lib/utils';
import getSession from '@/lib/data/auth/get-session';

export const updateVenueSocialData = async (
  venueId: number,
  data: VenueS3FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateVenueSocialData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'venue-manager'])) {
      console.error('[updateVenueSocialData] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = venueS3FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateVenueSocialData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('Dati inviati non corretti.');
    }

    const updateResult = await database
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
      .where(eq(venues.id, venueId))
      .returning({ slug: venues.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`, 'max');
    revalidateTag('venues', 'max');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateVenueSocialData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento locale non riuscito.',
      data: null,
    };
  }
};
