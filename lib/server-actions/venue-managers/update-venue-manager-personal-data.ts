'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq, inArray } from 'drizzle-orm';
import {
  profileLanguages,
  profiles,
  countries,
  languages as languagesTable,
  subdivisions,
} from '@/lib/database/schema';
import {
  venueManagerS1FormSchema,
  VenueManagerS1FormSchema,
} from '@/lib/validation/venue-manager-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { getUserProfileIdCached } from '@/lib/cache/users';
import getSession from '@/lib/data/auth/get-session';

export const updateVenueManagerPersonalData = async (
  profileId: number,
  data: VenueManagerS1FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateVenueManagerPersonalData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      const userProfileIdCheck = await getUserProfileIdCached(user.id);
      if (!userProfileIdCheck || userProfileIdCheck != profileId) {
        console.error('[updateVenueManagerPersonalData] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
    }

    const validation = venueManagerS1FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateVenueManagerPersonalData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { languages, countryId, subdivisionId } = validation.data;
    const safeLanguages = languages ?? [];
    const resolvedCountryId = countryId ?? null;
    const resolvedSubdivisionId = subdivisionId ?? null;

    const [languagesCheck, countryCheck, subdivisionCheck] = await Promise.all([
      safeLanguages.length
        ? database
            .select({ id: languagesTable.id })
            .from(languagesTable)
            .where(inArray(languagesTable.id, safeLanguages))
        : Promise.resolve([]),

      resolvedCountryId
        ? database
            .select({ id: countries.id })
            .from(countries)
            .where(eq(countries.id, resolvedCountryId))
        : Promise.resolve([]),

      resolvedSubdivisionId
        ? database
            .select({ id: subdivisions.id, countryId: subdivisions.countryId })
            .from(subdivisions)
            .where(eq(subdivisions.id, resolvedSubdivisionId))
        : Promise.resolve([]),
    ]);

    if (languagesCheck.length !== safeLanguages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

    if (resolvedCountryId && countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido');
    }

    if (resolvedSubdivisionId && subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (resolvedCountryId && resolvedSubdivisionId) {
      if (subdivisionCheck[0]?.countryId != resolvedCountryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
      }
    }

    await database.transaction(async (tx) => {
      const updateResult = await tx
        .update(profiles)
        .set({
          avatarUrl: data.avatarUrl || null,
          name: data.name || 'Utente',
          surname: data.surname || '',
          phone: data.phone || '',
          birthDate: data.birthDate || '1970-01-01',
          birthPlace: data.birthPlace || '',
          gender: data.gender || 'male',
          address: data.address || '',
          countryId: resolvedCountryId ?? data.countryId ?? 0,
          subdivisionId: resolvedSubdivisionId ?? data.subdivisionId ?? 0,
          city: data.city || '',
          zipCode: data.zipCode || '',
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, profileId))
        .returning({ userId: profiles.userId });

      const uid = updateResult[0]?.userId;
      if (uid) revalidateTag(`venue-manager:${uid}`, 'max');
      revalidateTag('venue-managers', 'max');

      // First delete existing languages
      await tx.delete(profileLanguages).where(eq(profileLanguages.profileId, profileId));

      // Then insert new ones
      const languageInserts = safeLanguages.map((languageId: number) => ({
        profileId,
        languageId,
      }));

      if (languageInserts.length > 0) {
        await tx.insert(profileLanguages).values(languageInserts);
      }
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateVenueManagerPersonalData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento profilo non riuscito.',
      data: null,
    };
  }
};
