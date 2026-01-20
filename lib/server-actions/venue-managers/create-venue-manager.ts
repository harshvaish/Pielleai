'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse, VenueManagerSelectData } from '@/lib/types';
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
import type { VenueManagerFormSchema } from '@/lib/validation/venue-manager-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const createVenueManager = async (
  data: VenueManagerFormSchema,
): Promise<ServerActionResponse<VenueManagerSelectData>> => {
  const headersList = await headers();
  let newUserId: string | undefined;
  let createdManager: VenueManagerSelectData | null = null;

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

    const { name, signUpEmail, signUpPassword, languages, countryId, subdivisionId } = data;
    const safeLanguages = Array.isArray(languages) ? languages : [];
    const fallbackName = name?.trim() || 'Utente';
    const finalEmail = signUpEmail?.trim() || null;
    const finalPassword = signUpPassword?.trim() || null;

    const placeholderText = 'Non disponibile';
    const placeholderZipCode = 'ND0';
    const placeholderGender = 'non-binary';
    const resolvedGender = data.gender ? data.gender : placeholderGender;
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
      let userId: string;

      // If both email and password provided, use Better Auth (user can login)
      if (finalEmail && finalPassword) {
        const { user } = await auth.api.createUser({
          headers: headersList,
          body: {
            email: finalEmail,
            password: finalPassword,
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

        userId = user.id;
      } else {
        // Create user directly with NULL email/password (cannot login)
        const userResult = await tx.insert(users).values({
          id: crypto.randomUUID(),
          name: fallbackName,
          email: finalEmail,
          emailVerified: false,
          role: 'venue-manager',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning({ id: users.id });

        if (!userResult[0]?.id) {
          throw new AppError("Errore durante la creazione dell'account.");
        }

        userId = userResult[0].id;
      }

      newUserId = userId;

      const profileResult = await tx
        .insert(profiles)
        .values({
          userId: newUserId,
          avatarUrl: data.avatarUrl ?? null,
          name: data.name ?? fallbackName,
          surname: data.surname ?? '',
          phone: data.phone ?? '',
          birthDate: data.birthDate ?? null,
          birthPlace: data.birthPlace?.trim() || placeholderText,
          gender: resolvedGender,
          address: data.address?.trim() || placeholderText,
          ...(countryId !== undefined && countryId !== null && { countryId }),
          ...(subdivisionId !== undefined && subdivisionId !== null && { subdivisionId }),
          city: data.city?.trim() || placeholderText,
          zipCode: data.zipCode?.trim() || placeholderZipCode,
        })
        .returning({ id: profiles.id, userId: profiles.userId });

      const profileId = profileResult[0]?.id;
      if (!profileId) {
        throw new AppError('Recupero id utente non riuscito.');
      }

      createdManager = {
        id: newUserId,
        profileId,
        avatarUrl: data.avatarUrl ?? null,
        name: data.name ?? fallbackName,
        surname: data.surname ?? '',
        status: 'active',
      };

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

    if (!createdManager) {
      throw new AppError('Recupero utente non riuscito.');
    }

    return {
      success: true,
      message: null,
      data: createdManager,
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
