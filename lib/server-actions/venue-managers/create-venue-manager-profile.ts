'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq, inArray } from 'drizzle-orm';
import {
  profileLanguages,
  profiles,
  countries,
  languages as languagesTable,
  subdivisions,
  users,
} from '@/lib/database/schema';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { userIdValidation } from '@/lib/validation/_general';
import {
  venueManagerS1FormSchema,
  VenueManagerS1FormSchema,
} from '@/lib/validation/venue-manager-form-schema';

export const createVenueManagerProfile = async (
  uid: string,
  data: VenueManagerS1FormSchema,
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();

  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      console.error('[createVenueManagerProfile] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const uidValidation = userIdValidation.safeParse(uid);
    const dataValidation = venueManagerS1FormSchema.safeParse(data);

    if (!uidValidation.success) {
      console.error(
        '[createVenueManagerProfile] - Error: uid validation failed',
        uidValidation.error.issues[0],
      );
      throw new AppError('Utente non valido.');
    }

    if (!dataValidation.success) {
      console.error(
        '[createVenueManagerProfile] - Error: data validation failed',
        dataValidation.error.issues[0],
      );
      throw new AppError('Dati inviati non validi.');
    }

    const { name, languages, countryId, subdivisionId } = dataValidation.data;

    const [userCheck, languagesCheck, countryCheck, subdivisionCheck] = await Promise.all([
      database.select({ id: users.id }).from(users).where(eq(users.id, uid)).limit(1),

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

    if (userCheck.length !== 1) {
      throw new AppError('Utenza non trovata.');
    }

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
      await tx.update(users).set({ name: name, role: 'venue-manager' }).where(eq(users.id, uid));

      const profileResult = await tx
        .insert(profiles)
        .values({
          userId: uid,
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
        })
        .returning({ id: profiles.id, userId: profiles.userId });

      const profileId = profileResult[0]?.id;

      if (!profileId) {
        throw new AppError('Recupero profilo utente non riuscito.');
      }

      if (uid) {
        revalidateTag(`profile:${uid}`);
        revalidateTag(`venue-manager:${uid}`);
      }
      revalidateTag('venue-managers');

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
    let message = 'Creazione profilo non riuscita.';
    if (error instanceof APIError && error.body?.code) {
      message = getBetterAuthErrorMessage(error.body.code);
    }

    console.error('[createVenueManagerProfile] transaction failed', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : message,
      data: null,
    };
  }
};
