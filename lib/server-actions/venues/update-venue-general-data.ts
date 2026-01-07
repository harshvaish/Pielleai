'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { profiles, countries, subdivisions, users, venues } from '@/lib/database/schema';
import { venueS1FormSchema, VenueS1FormSchema } from '@/lib/validation/venue-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';

export const updateVenueGeneralData = async (
  venueId: number,
  data: VenueS1FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateVenueGeneralData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'venue-manager'])) {
      console.error('[updateVenueGeneralData] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = venueS1FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateVenueGeneralData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { countryId, subdivisionId, venueManagerId } = validation.data;

    const [countryCheck, subdivisionCheck] = await Promise.all([
      countryId !== undefined && countryId !== null
        ? database
            .select({ id: countries.id })
            .from(countries)
            .where(eq(countries.id, countryId))
        : Promise.resolve([]),

      subdivisionId !== undefined && subdivisionId !== null
        ? database
            .select({ id: subdivisions.id, countryId: subdivisions.countryId })
            .from(subdivisions)
            .where(eq(subdivisions.id, subdivisionId))
        : Promise.resolve([]),
    ]);

    if (countryId !== undefined && countryId !== null && countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (subdivisionId !== undefined && subdivisionId !== null && subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (countryId !== undefined && countryId !== null && subdivisionId !== undefined && subdivisionId !== null) {
      if (subdivisionCheck[0]?.countryId != countryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
      }
    }

    if (venueManagerId) {
      const venueManagerCheck = await database
        .select({ id: profiles.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(and(eq(users.role, 'venue-manager'), eq(profiles.id, venueManagerId)));

      if (venueManagerCheck.length !== 1) {
        throw new AppError('Manager selezionato non valido.');
      }
    }

    const updateResult = await database
      .update(venues)
      .set({
        avatarUrl: validation.data.avatarUrl || null,
        name: validation.data.name || 'Locale',
        bio: validation.data.bio || null,
        type: validation.data.type || 'small',
        capacity: validation.data.capacity ?? 0,
        address: validation.data.address || '',
        ...(countryId !== undefined && countryId !== null && { countryId }),
        ...(subdivisionId !== undefined && subdivisionId !== null && { subdivisionId }),
        city: validation.data.city || '',
        zipCode: validation.data.zipCode || '',
        managerProfileId: venueManagerId || null,
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
    console.error('[updateVenueGeneralData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento locale non riuscito.',
      data: null,
    };
  }
};
