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
} from '@/lib/validation/venueManagerFormSchema';

export const createVenueManager = async (
  data: VenueManagerFormSchema
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[createVenueManager] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[createVenueManager] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = venueManagerFormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[createVenueManager] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const {
    name,
    signUpEmail,
    signUpPassword,
    languages,
    countryId,
    subdivisionId,
  } = validation.data;

  let newUserId: string | undefined;

  try {
    const [languagesCheck, countryCheck, subdivisionCheck] = await Promise.all([
      database
        .select({ id: languagesTable.id })
        .from(languagesTable)
        .where(inArray(languagesTable.id, languages)),

      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, countryId)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, subdivisionId)),
    ]);

    if (languagesCheck.length !== languages.length) {
      return {
        success: false,
        message: 'Una o più lingue selezionate non valide.',
        data: null,
      };
    }

    if (countryCheck.length !== 1) {
      return {
        success: false,
        message: 'Stato selezionato non valido.',
        data: null,
      };
    }

    if (subdivisionCheck.length !== 1) {
      return {
        success: false,
        message: 'Provincia selezionata non valida.',
        data: null,
      };
    }

    if (subdivisionCheck[0].countryId != countryId) {
      return {
        success: false,
        message: 'La provincia selezionata non appartiene allo stato indicato.',
        data: null,
      };
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
        return {
          success: false,
          message: "Errore durante la creazione dell'account.",
          data: null,
        };
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
        .returning({ id: profiles.id });

      const profileId = profileResult[0]?.id;
      if (!profileId) {
        return {
          success: false,
          message: 'Recupero id utente non riuscito.',
          data: null,
        };
      }

      const languageInserts = (data.languages || []).map(
        (languageId: number) => ({
          profileId,
          languageId,
        })
      );

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
        console.error(
          '[createVenueManager] rollback: failed deleting auth user',
          delErr
        );
      }
    }

    let message = 'Creazione account non riuscita.';
    if (error instanceof APIError && error.body?.code) {
      message = getBetterAuthErrorMessage(error.body.code);
    }

    console.error('[createVenueManager] transaction failed', error);
    return {
      success: false,
      message,
      data: null,
    };
  }
};
