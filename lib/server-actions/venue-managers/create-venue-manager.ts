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

export const createVenueManager = async (
  data: VenueManagerFormSchema,
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  let newUserId: string | undefined;

  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
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
      const { user } = await auth.api.createUser({
        headers: headersList,
        body: {
          email: signUpEmail,
          password: signUpPassword,
          name,
          role: 'venue-manager',
          data: {
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
        throw new AppError('Recupero id utente non riuscito.');
      }

      const uid = profileResult[0]?.userId;
      if (uid) {
        revalidateTag(`profile:${uid}`);
        revalidateTag(`venue-manager:${uid}`);
      }
      revalidateTag('venue-managers');
      revalidateTag('paginated-venue-managers');

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
