'use server';

import { ServerActionResponse } from '@/lib/types';
import {
  artistManagerProfileFormSchema,
  ArtistManagerProfileFormSchema,
} from '@/lib/validation/artist-manager-form-schema';
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
import getSession from '@/lib/data/auth/get-session';

export const createArtistManagerProfile = async (
  uid: string,
  data: ArtistManagerProfileFormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createArtistManagerProfile] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      if (user.id != uid) {
        console.error('[createArtistManagerProfile] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
    }

    const uidValidation = userIdValidation.safeParse(uid);
    const dataValidation = artistManagerProfileFormSchema.safeParse(data);

    if (!uidValidation.success) {
      console.error(
        '[createArtistManagerProfile] - Error: uid validation failed',
        uidValidation.error.issues[0],
      );
      throw new AppError('Utente non valido.');
    }

    if (!dataValidation.success) {
      console.error(
        '[createArtistManagerProfile] - Error: data validation failed',
        dataValidation.error.issues[0],
      );
      throw new AppError('Dati inviati non validi.');
    }

    const { name, languages, countryId, subdivisionId, billingCountry, billingSubdivisionId } =
      dataValidation.data;
    const safeLanguages = languages ?? [];
    const fallbackName = name?.trim() || 'Utente';
    const billingCountryId = billingCountry?.id;

    const [
      userCheck,
      languagesCheck,
      countryCheck,
      subdivisionCheck,
      billingCountryCheck,
      billingSubdivisionCheck,
    ] = await Promise.all([
      database.select({ id: users.id }).from(users).where(eq(users.id, uid)).limit(1),

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

      billingCountryId !== undefined && billingCountryId !== null
        ? database
            .select({ id: countries.id })
            .from(countries)
            .where(eq(countries.id, billingCountryId))
        : Promise.resolve([]),

      billingSubdivisionId !== undefined && billingSubdivisionId !== null
        ? database
            .select({ id: subdivisions.id, countryId: subdivisions.countryId })
            .from(subdivisions)
            .where(eq(subdivisions.id, billingSubdivisionId))
        : Promise.resolve([]),
    ]);

    if (userCheck.length !== 1) {
      throw new AppError('Utenza non trovata.');
    }

    if (languagesCheck.length !== safeLanguages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

    if (countryId !== undefined && countryId !== null && countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (billingCountryId !== undefined && billingCountryId !== null && billingCountryCheck.length !== 1) {
      throw new AppError('Nazione selezionata non valida.');
    }

    if (subdivisionId !== undefined && subdivisionId !== null && subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (billingSubdivisionId !== undefined && billingSubdivisionId !== null && billingSubdivisionCheck.length !== 1) {
      throw new AppError('Provincia di fatturazione selezionata non valida.');
    }

    if (countryId !== undefined && countryId !== null && subdivisionId !== undefined && subdivisionId !== null) {
      if (subdivisionCheck[0]?.countryId != countryId) {
        throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
      }
    }

    if (billingCountryId !== undefined && billingCountryId !== null && billingSubdivisionId !== undefined && billingSubdivisionId !== null) {
      if (billingSubdivisionCheck[0]?.countryId != billingCountryId) {
        throw new AppError(
          'La provincia di fatturazione non appartiene alla nazione selezionata.',
        );
      }
    }

    await database.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ name: fallbackName, role: 'artist-manager' })
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
          ...(countryId !== undefined && countryId !== null && { countryId }),
          ...(subdivisionId !== undefined && subdivisionId !== null && { subdivisionId }),
          city: data.city || '',
          zipCode: data.zipCode || '',

          company: data.company || null,
          taxCode: data.taxCode || null,
          ipiCode: data.ipiCode || null,
          bicCode: data.bicCode || null,
          abaRoutingNumber: data.abaRoutingNumber || null,
          iban: data.iban || null,
          sdiRecipientCode: data.sdiRecipientCode || null,
          billingAddress: data.billingAddress || null,
          ...(billingCountryId !== undefined && billingCountryId !== null && { billingCountryId }),
          ...(billingSubdivisionId !== undefined && billingSubdivisionId !== null && { billingSubdivisionId }),
          billingCity: data.billingCity || null,
          billingZipCode: data.billingZipCode || null,
          billingEmail: data.billingEmail || null,
          billingPhone: data.billingPhone || null,
          billingPec: data.billingPec || null,
          taxableInvoice: data.taxableInvoice === 'true',
        })
        .returning({ id: profiles.id, userId: profiles.userId });

      const profileId = profileResult[0]?.id;

      if (!profileId) {
        throw new AppError('Recupero profilo utente non riuscito.');
      }

      if (uid) {
        revalidateTag(`profile:${uid}`, 'max');
        revalidateTag(`artist-manager:${uid}`, 'max');
      }
      revalidateTag('artist-managers','max');

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

    console.error('[createArtistManagerProfile] transaction failed', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : message,
      data: null,
    };
  }
};
