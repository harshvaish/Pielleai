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
import getSession from '@/lib/data/auth/get-session';

export const createVenueManagerProfile = async (
  uid: string,
  data: VenueManagerS1FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createVenueManagerProfile] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      if (user.id != uid) {
        console.error('[createVenueManagerProfile] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
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
    const safeLanguages = languages ?? [];
    const fallbackName = name?.trim() || 'Utente';

    const defaultCountry = await database.select({ id: countries.id }).from(countries).limit(1);
    const defaultCountryId = defaultCountry[0]?.id;
    if (!defaultCountryId) {
      throw new AppError('Nessuna nazione disponibile.');
    }

    const getDefaultSubdivisionId = async (resolvedCountryId: number) => {
      const rows = await database
        .select({ id: subdivisions.id })
        .from(subdivisions)
        .where(eq(subdivisions.countryId, resolvedCountryId))
        .limit(1);
      const id = rows[0]?.id;
      if (!id) {
        throw new AppError('Nessuna provincia disponibile.');
      }
      return id;
    };

    const resolvedCountryId = countryId ?? defaultCountryId;
    const resolvedSubdivisionId =
      subdivisionId ?? (await getDefaultSubdivisionId(resolvedCountryId));

    const [userCheck, languagesCheck, countryCheck, subdivisionCheck] = await Promise.all([
      database.select({ id: users.id }).from(users).where(eq(users.id, uid)).limit(1),

      safeLanguages.length
        ? database
            .select({ id: languagesTable.id })
            .from(languagesTable)
            .where(inArray(languagesTable.id, safeLanguages))
        : Promise.resolve([]),

      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, resolvedCountryId)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, resolvedSubdivisionId)),
    ]);

    if (userCheck.length !== 1) {
      throw new AppError('Utenza non trovata.');
    }

    if (languagesCheck.length !== safeLanguages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

    if (countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (subdivisionCheck[0].countryId != resolvedCountryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
    }

    await database.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ name: fallbackName, role: 'venue-manager' })
        .where(eq(users.id, uid));

      const profileResult = await tx
        .insert(profiles)
        .values({
          userId: uid,
          avatarUrl: data.avatarUrl || null,
          name: data.name || fallbackName,
          surname: data.surname || '',
          phone: data.phone || '',
          birthDate: data.birthDate || '1970-01-01',
          birthPlace: data.birthPlace || '',
          gender: data.gender || 'male',
          address: data.address || '',
          countryId: resolvedCountryId,
          subdivisionId: resolvedSubdivisionId,
          city: data.city || '',
          zipCode: data.zipCode || '',
        })
        .returning({ id: profiles.id, userId: profiles.userId });

      const profileId = profileResult[0]?.id;

      if (!profileId) {
        throw new AppError('Recupero profilo utente non riuscito.');
      }

      if (uid) {
        revalidateTag(`profile:${uid}`, 'max');
        revalidateTag(`venue-manager:${uid}`, 'max');
      }
      revalidateTag('venue-managers', 'max');

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
