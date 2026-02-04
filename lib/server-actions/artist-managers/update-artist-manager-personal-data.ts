'use server';

import { ServerActionResponse } from '@/lib/types';
import {
  ArtistManagerS1FormSchema,
  artistManagerS1FormSchema,
} from '@/lib/validation/artist-manager-form-schema';
import { database } from '@/lib/database/connection';
import { eq, inArray } from 'drizzle-orm';
import {
  profileLanguages,
  profiles,
  countries,
  languages as languagesTable,
  subdivisions,
} from '@/lib/database/schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { getUserProfileIdCached } from '@/lib/cache/users';
import getSession from '@/lib/data/auth/get-session';

export const updateArtistManagerPersonalData = async (
  profileId: number,
  data: ArtistManagerS1FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateArtistManagerPersonalData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      const userProfileIdCheck = await getUserProfileIdCached(user.id);
      if (!userProfileIdCheck || userProfileIdCheck != profileId) {
        console.error('[updateArtistManagerPersonalData] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
    }

    const validation = artistManagerS1FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateArtistManagerPersonalData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { languages, countryId, subdivisionId } = validation.data;
    const safeLanguages = languages ?? [];

    const [languagesCheck, countryCheck, subdivisionCheck] = await Promise.all([
      safeLanguages.length
        ? database
            .select({ id: languagesTable.id })
            .from(languagesTable)
            .where(inArray(languagesTable.id, safeLanguages))
        : Promise.resolve([]),

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

    if (languagesCheck.length !== safeLanguages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

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

    await database.transaction(async (tx) => {
      const updateResult = await tx
        .update(profiles)
        .set({
          avatarUrl: data.avatarUrl || null,
          name: data.name || 'Utente',
          surname: data.surname || '',
          phone: data.phone || '',
          birthDate: data.birthDate || null,
          birthPlace: data.birthPlace || '',
          ...(data.gender && { gender: data.gender }),
          address: data.address || '',
          addressFormatted: data.addressFormatted ?? null,
          streetName: data.streetName ?? null,
          streetNumber: data.streetNumber ?? null,
          placeId: data.placeId ?? null,
          latitude: data.latitude ? data.latitude : null,
          longitude: data.longitude ? data.longitude : null,
          countryName: data.countryName ?? null,
          countryCode: data.countryCode ?? null,
          ...(countryId !== undefined && countryId !== null && { countryId }),
          ...(subdivisionId !== undefined && subdivisionId !== null && { subdivisionId }),
          city: data.city || '',
          zipCode: data.zipCode || '',
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, profileId))
        .returning({ userId: profiles.userId });

      const uid = updateResult[0]?.userId;
      if (uid) revalidateTag(`artist-manager:${uid}`, 'max');
      revalidateTag('artist-managers', 'max');

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
    console.error('[updateArtistManagerPersonalData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento profilo non riuscito.',
      data: null,
    };
  }
};
