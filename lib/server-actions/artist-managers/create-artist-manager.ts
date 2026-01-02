'use server';

import { auth } from '@/lib/auth';
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
import getSession from '@/lib/data/auth/get-session';
import { headers } from 'next/headers';

export const createArtistManager = async (
  data: ArtistManagerFormSchema,
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  let newUserId: string | undefined;

  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createArtistManager] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
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
    const billingCountryId = billingCountry?.id ?? null;
    const resolvedBillingSubdivisionId = billingCountryId
      ? billingSubdivisionId ?? (await getDefaultSubdivisionId(billingCountryId))
      : null;

    const [
      languagesCheck,
      countryCheck,
      subdivisionCheck,
      billingCountryCheck,
      billingSubdivisionCheck,
    ] = await Promise.all([
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

      billingCountryId
        ? database
            .select({ id: countries.id })
            .from(countries)
            .where(eq(countries.id, billingCountryId))
        : Promise.resolve([]),

      resolvedBillingSubdivisionId
        ? database
            .select({ id: subdivisions.id, countryId: subdivisions.countryId })
            .from(subdivisions)
            .where(eq(subdivisions.id, resolvedBillingSubdivisionId))
        : Promise.resolve([]),
    ]);

    if (languagesCheck.length !== safeLanguages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

    if (countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (billingCountryId && billingCountryCheck.length !== 1) {
      throw new AppError('Nazione selezionata non valida.');
    }

    if (subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (resolvedBillingSubdivisionId && billingSubdivisionCheck.length !== 1) {
      throw new AppError('Provincia di fatturazione selezionata non valida.');
    }

    if (subdivisionCheck[0].countryId != resolvedCountryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
    }

    if (billingCountryId && resolvedBillingSubdivisionId) {
      if (billingSubdivisionCheck[0]?.countryId != billingCountryId) {
        throw new AppError(
          'La provincia di fatturazione non appartiene alla nazione selezionata.',
        );
      }
    }

    await database.transaction(async (tx) => {
      const { user } = await auth.api.createUser({
        headers: headersList,
        body: {
          email: fallbackEmail,
          password: fallbackPassword,
          name: fallbackName,
          role: 'artist-manager',
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

          company: data.company || null,
          taxCode: data.taxCode || null,
          ipiCode: data.ipiCode || null,
          bicCode: data.bicCode || null,
          abaRoutingNumber: data.abaRoutingNumber || null,
          iban: data.iban || null,
          sdiRecipientCode: data.sdiRecipientCode || null,
          billingAddress: data.billingAddress || null,
          billingCountryId: billingCountryId,
          billingSubdivisionId: resolvedBillingSubdivisionId,
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
        throw new AppError('Recupero id utente non riuscito.');
      }

      const uid = profileResult[0]?.userId;
      if (uid) {
        revalidateTag(`profile:${uid}`,'max');
        revalidateTag(`artist-manager:${uid}`,'max');
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
