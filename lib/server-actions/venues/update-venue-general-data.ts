'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { profiles, countries, subdivisions, users, venues } from '@/lib/database/schema';
import { editVenueS1FormSchema, EditVenueS1FormSchema } from '@/lib/validation/venue-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';

export const updateVenueGeneralData = async (
  venueId: number,
  data: EditVenueS1FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[updateVenueGeneralData] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = editVenueS1FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateVenueGeneralData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { countryId, subdivisionId, venueManagerId } = validation.data;

    const [countryCheck, subdivisionCheck, venueManagerCheck] = await Promise.all([
      database.select({ id: countries.id }).from(countries).where(eq(countries.id, countryId)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, subdivisionId)),

      database
        .select({ id: profiles.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(and(eq(users.role, 'venue-manager'), eq(profiles.id, venueManagerId))),
    ]);

    if (countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (subdivisionCheck[0].countryId != countryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
    }

    if (venueManagerCheck.length !== 1) {
      throw new AppError('Manager selezionato non valido.');
    }

    const updateResult = await database
      .update(venues)
      .set({
        avatarUrl: validation.data.avatarUrl,
        name: validation.data.name,
        type: validation.data.type,
        capacity: validation.data.capacity,
        address: validation.data.address,
        countryId: validation.data.countryId,
        subdivisionId: validation.data.subdivisionId,
        city: validation.data.city,
        zipCode: validation.data.zipCode,
        managerProfileId: venueManagerId,
        updatedAt: new Date(),
      })
      .where(eq(venues.id, venueId))
      .returning({ slug: venues.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`);
    revalidateTag('venues');
    revalidateTag('paginated-venues');

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
