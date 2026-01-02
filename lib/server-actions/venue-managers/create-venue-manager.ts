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
} from '@/lib/database/schema';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import {
  venueManagerFormSchema,
  VenueManagerFormSchema,
} from '@/lib/validation/venue-manager-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const createVenueManager = async (
  data: VenueManagerFormSchema,
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  let newUserId: string | undefined;

  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createVenueManager] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      console.error('[createVenueManager] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = venueManagerFormSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createVenueManager] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('Dati inviati non corretti.');
    }

    const { name, signUpEmail, signUpPassword, languages, countryId, subdivisionId } =
      validation.data;
    const safeLanguages = languages ?? [];
    const fallbackName = name?.trim() || 'Utente';
    const fallbackEmail =
      signUpEmail?.trim() ||
      `placeholder+${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fallbackPassword = signUpPassword?.trim() || 'TempPass1234!';

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

    const [languagesCheck, countryCheck, subdivisionCheck] = await Promise.all([
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
      const { user } = await auth.api.createUser({
        headers: headersList,
        body: {
          email: fallbackEmail,
          password: fallbackPassword,
          name: fallbackName,
          role: 'venue-manager',
          data: {
            emailVerified: true,
            status: 'active',
          },
        },
      });

      if (!user || !user.id) {
        throw new AppError("Errore durante la creazione dell'account.");
      }

      newUserId = user.id;

      const profileResult = await tx
        .insert(profiles)
        .values({
          userId: newUserId,
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
        throw new AppError('Recupero id utente non riuscito.');
      }

      const uid = profileResult[0]?.userId;
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
    if (newUserId) {
      try {
        await auth.api.removeUser({
          headers: headersList,
          body: { userId: newUserId },
        });
      } catch (delErr) {
        console.error('[createVenueManager] rollback: failed deleting auth user', delErr);
      }
    }

    let message = 'Creazione account non riuscita.';
    if (error instanceof APIError && error.body?.code) {
      message = getBetterAuthErrorMessage(error.body.code);
    }

    console.error('[createVenueManager] transaction failed', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : message,
      data: null,
    };
  }
};
