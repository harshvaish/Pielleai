'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
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

export const updateArtistManagerPersonalData = async (
  profileId: number,
  data: ArtistManagerS1FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[updateArtistManagerPersonalData] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
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

    const [languagesCheck, countryCheck, subdivisionCheck] = await Promise.all([
      database
        .select({ id: languagesTable.id })
        .from(languagesTable)
        .where(inArray(languagesTable.id, languages)),

      database.select({ id: countries.id }).from(countries).where(eq(countries.id, countryId)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, subdivisionId)),
    ]);

    if (languagesCheck.length !== languages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

    if (countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (subdivisionCheck[0].countryId != countryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
    }

    await database.transaction(async (tx) => {
      const updateResult = await tx
        .update(profiles)
        .set({
          avatarUrl: data.avatarUrl,
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          birthDate: data.birthDate,
          birthPlace: data.birthPlace,
          gender: data.gender,
          address: data.address,
          countryId: data.countryId,
          subdivisionId: data.subdivisionId,
          city: data.city,
          zipCode: data.zipCode,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, profileId))
        .returning({ userId: profiles.userId });

      const uid = updateResult[0]?.userId;
      if (uid) revalidateTag(`artist-manager:${uid}`);
      revalidateTag('artist-managers');

      // First delete existing languages
      await tx.delete(profileLanguages).where(eq(profileLanguages.profileId, profileId));

      // Then insert new ones
      const languageInserts = (data.languages || []).map((languageId: number) => ({
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
