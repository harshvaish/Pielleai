'use server';

import { auth } from '@/lib/auth';
import { ArtistManagerSelectData, ServerActionResponse } from '@/lib/types';
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
  users,
} from '@/lib/database/schema';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';
import { headers } from 'next/headers';

export const createArtistManager = async (
  data: ArtistManagerFormSchema,
): Promise<ServerActionResponse<ArtistManagerSelectData>> => {
  const headersList = await headers();
  let newUserId: string | undefined;
  let createdManager: ArtistManagerSelectData | null = null;

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

    const sanitizeName = (value?: string | null) => {
      if (typeof value !== 'string') return value;
      return value.replace(/[^\p{L}\s'-]/gu, '').trim();
    };

    const validation = artistManagerFormSchema.safeParse({
      ...data,
      name: sanitizeName(data.name),
      surname: sanitizeName(data.surname),
    });

    if (!validation.success) {
      console.error('[createArtistManager] - Error: validation failed', validation.error.issues[0]);
      const issue = validation.error.issues[0];
      const message = issue?.message || 'Dati inviati non validi.';
      throw new AppError(message);
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
    const finalEmail = signUpEmail?.trim() || null;
    const finalPassword = signUpPassword?.trim() || null;
    const billingCountryId = billingCountry?.id;

    const placeholderText = 'Non disponibile';
    const placeholderZipCode = 'ND0';
    const placeholderGender = 'non-binary';
    const resolvedGender =
      validation.data.gender
        ? validation.data.gender
        : placeholderGender;
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
      let userId: string;

      // If both email and password provided, use Better Auth (user can login)
      if (finalEmail && finalPassword) {
        const { user } = await auth.api.createUser({
          headers: headersList,
          body: {
            email: finalEmail,
            password: finalPassword,
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

        userId = user.id;
      } else {
        // Create user directly with NULL email/password (cannot login)
        const userResult = await tx.insert(users).values({
          id: crypto.randomUUID(),
          name: fallbackName,
          email: finalEmail,
          emailVerified: false,
          role: 'artist-manager',
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
          avatarUrl: validation.data.avatarUrl ?? null,
          name: validation.data.name ?? fallbackName,
          surname: validation.data.surname ?? '',
          phone: validation.data.phone ?? '',
          birthDate: validation.data.birthDate ?? null,
          birthPlace: validation.data.birthPlace?.trim() || placeholderText,
          gender: resolvedGender,
          address: validation.data.address?.trim() || placeholderText,
          ...(countryId !== undefined && countryId !== null && { countryId }),
          ...(subdivisionId !== undefined && subdivisionId !== null && { subdivisionId }),
          city: validation.data.city?.trim() || placeholderText,
          zipCode: validation.data.zipCode?.trim() || placeholderZipCode,

          company: validation.data.company ?? null,
          taxCode: validation.data.taxCode ?? null,
          ipiCode: validation.data.ipiCode ?? null,
          bicCode: validation.data.bicCode ?? null,
          abaRoutingNumber: validation.data.abaRoutingNumber ?? null,
          iban: validation.data.iban ?? null,
          sdiRecipientCode: validation.data.sdiRecipientCode ?? null,
          billingAddress: validation.data.billingAddress ?? null,
          ...(billingCountryId !== undefined && billingCountryId !== null && { billingCountryId }),
          ...(billingSubdivisionId !== undefined && billingSubdivisionId !== null && { billingSubdivisionId }),
          ...(validation.data.billingCity && { billingCity: validation.data.billingCity }),
          ...(validation.data.billingZipCode && { billingZipCode: validation.data.billingZipCode }),
          ...(validation.data.billingEmail && { billingEmail: validation.data.billingEmail }),
          ...(validation.data.billingPhone && { billingPhone: validation.data.billingPhone }),
          ...(validation.data.billingPec && { billingPec: validation.data.billingPec }),
          taxableInvoice: validation.data.taxableInvoice === 'true',
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
