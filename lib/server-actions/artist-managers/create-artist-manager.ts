'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import {
  artistManagerFormSchema,
  ArtistManagerFormSchema,
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
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';

export const createArtistManager = async (
  data: ArtistManagerFormSchema,
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  let newUserId: string | undefined;

  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[createArtistManager] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = artistManagerFormSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createArtistManager] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const {
      name,
      signUpEmail,
      signUpPassword,
      languages,
      countryId,
      subdivisionId,
      billingCountry,
      billingSubdivisionId,
    } = validation.data;

    const [
      languagesCheck,
      countryCheck,
      subdivisionCheck,
      billingCountryCheck,
      billingSubdivisionCheck,
    ] = await Promise.all([
      database
        .select({ id: languagesTable.id })
        .from(languagesTable)
        .where(inArray(languagesTable.id, languages)),

      database.select({ id: countries.id }).from(countries).where(eq(countries.id, countryId)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, subdivisionId)),

      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, billingCountry.id)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, billingSubdivisionId)),
    ]);

    if (languagesCheck.length !== languages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

    if (countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (billingCountryCheck.length !== 1) {
      throw new AppError('Stato fatturazione selezionato non valido.');
    }

    if (subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (billingSubdivisionCheck.length !== 1) {
      throw new AppError('Provincia fatturazione selezionata non valida.');
    }

    if (subdivisionCheck[0].countryId != countryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
    }

    if (billingSubdivisionCheck[0].countryId != billingCountry.id) {
      throw new AppError(
        'La provincia fatturazione non appartiene allo stato fatturazione selezionato.',
      );
    }

    await database.transaction(async (tx) => {
      const { user } = await auth.api.createUser({
        headers: headersList,
        body: {
          email: signUpEmail,
          password: signUpPassword,
          name,
          role: 'artist-manager',
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

          company: data.company,
          taxCode: data.taxCode,
          ipiCode: data.ipiCode,
          bicCode: data.bicCode,
          abaRoutingNumber: data.abaRoutingNumber,
          iban: data.iban,
          sdiRecipientCode: data.sdiRecipientCode,
          billingAddress: data.billingAddress,
          billingCountryId: data.billingCountry.id,
          billingSubdivisionId: data.billingSubdivisionId,
          billingCity: data.billingCity,
          billingZipCode: data.billingZipCode,
          billingEmail: data.billingEmail,
          billingPhone: data.billingPhone,
          billingPec: data.billingPec,
          taxableInvoice: data.taxableInvoice === 'true',
        })
        .returning({ id: profiles.id, userId: profiles.userId });

      const profileId = profileResult[0]?.id;

      if (!profileId) {
        throw new AppError('Recupero id utente non riuscito.');
      }

      const uid = profileResult[0]?.userId;
      if (uid) {
        revalidateTag(`profile:${uid}`);
        revalidateTag(`artist-manager:${uid}`);
      }
      revalidateTag('artist-managers');
      revalidateTag('paginated-artist-managers');

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
        console.error('[createArtistManager] rollback: failed deleting auth user', delErr);
      }
    }

    let message = 'Creazione account non riuscita.';
    if (error instanceof APIError && error.body?.code) {
      message = getBetterAuthErrorMessage(error.body.code);
    }

    console.error('[createArtistManager] transaction failed', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : message,
      data: null,
    };
  }
};
