'use server';

import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { artistBlacklistedVenues, venues } from '@/lib/database/schema';
import { ArtistBlacklistVenue, ServerActionResponse } from '@/lib/types';
import { idValidation } from '@/lib/validation/_general';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import { ensureArtistBlacklistAccess } from './ensure-artist-blacklist-access';

export const addArtistBlacklistedVenue = async (
  artistId: number,
  venueId: number,
): Promise<ServerActionResponse<ArtistBlacklistVenue>> => {
  try {
    const user = await ensureArtistBlacklistAccess(artistId);

    const schema = z.object({
      artistId: idValidation,
      venueId: idValidation,
    });

    const validation = schema.safeParse({ artistId, venueId });

    if (!validation.success) {
      console.error(
        '[addArtistBlacklistedVenue] - Error: validation failed - ',
        validation.error.issues[0],
      );
      throw new AppError('Dati inviati non corretti.');
    }

    const [venue] = await database
      .select({
        id: venues.id,
        slug: venues.slug,
        status: venues.status,
        avatarUrl: venues.avatarUrl,
        name: venues.name,
        address: venues.address,
        city: venues.city,
      })
      .from(venues)
      .where(eq(venues.id, validation.data.venueId))
      .limit(1);

    if (!venue) {
      throw new AppError('Locale non valido.');
    }

    const [existing] = await database
      .select({ id: artistBlacklistedVenues.id })
      .from(artistBlacklistedVenues)
      .where(
        and(
          eq(artistBlacklistedVenues.artistId, validation.data.artistId),
          eq(artistBlacklistedVenues.venueId, validation.data.venueId),
        ),
      )
      .limit(1);

    if (existing) {
      throw new AppError('Locale gia presente in blacklist.');
    }

    const [inserted] = await database
      .insert(artistBlacklistedVenues)
      .values({
        artistId: validation.data.artistId,
        venueId: validation.data.venueId,
        createdByUserId: user.id,
      })
      .returning({ id: artistBlacklistedVenues.id });

    if (!inserted) {
      throw new AppError('Inserimento non riuscito.');
    }

    return {
      success: true,
      message: null,
      data: {
        id: inserted.id,
        venue: {
          id: venue.id,
          slug: venue.slug,
          status: venue.status,
          avatarUrl: venue.avatarUrl,
          name: venue.name,
          address: venue.address,
          city: venue.city,
        },
      },
    };
  } catch (error) {
    console.error('[addArtistBlacklistedVenue] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Inserimento blacklist non riuscito.',
      data: null,
    };
  }
};
