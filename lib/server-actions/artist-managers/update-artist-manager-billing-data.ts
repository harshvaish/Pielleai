'use server';

import { ServerActionResponse } from '@/lib/types';
import {
  ArtistManagerS2FormSchema,
  artistManagerS2FormSchema,
} from '@/lib/validation/artist-manager-form-schema';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { profiles, countries, subdivisions } from '@/lib/database/schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { getUserProfileIdCached } from '@/lib/cache/users';
import getSession from '@/lib/data/auth/get-session';

export const updateArtistManagerBillingData = async (
  profileId: number,
  data: ArtistManagerS2FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateArtistManagerBillingData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      const userProfileIdCheck = await getUserProfileIdCached(user.id);
      if (!userProfileIdCheck || userProfileIdCheck != profileId) {
        console.error('[updateArtistManagerBillingData] - Error: unauthorized', session);
        throw new AppError('Non sei autorizzato.');
      }
    }

    const validation = artistManagerS2FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateArtistManagerBillingData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { billingCountry, billingSubdivisionId } = validation.data;

    const [billingCountryCheck, billingSubdivisionCheck] = await Promise.all([
      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, billingCountry.id)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, billingSubdivisionId)),
    ]);

    if (billingCountryCheck.length !== 1) {
      throw new AppError('Nazione selezionata non valida.');
    }

    if (billingSubdivisionCheck.length !== 1) {
      throw new AppError('Provincia di fatturazione selezionata non valida.');
    }

    if (billingSubdivisionCheck[0].countryId != billingCountry.id) {
      throw new AppError('La provincia di fatturazione non appartiene alla nazione selezionata.');
    }

    const updateResult = await database
      .update(profiles)
      .set({
        company: data.company,
        taxCode: data.taxCode,
        ipiCode: data.ipiCode,
        bicCode: data.bicCode || null,
        abaRoutingNumber: data.abaRoutingNumber || null,
        iban: data.iban,
        sdiRecipientCode: data.sdiRecipientCode || null,
        billingAddress: data.billingAddress,
        billingCountryId: data.billingCountry.id,
        billingSubdivisionId: data.billingSubdivisionId,
        billingCity: data.billingCity,
        billingZipCode: data.billingZipCode,
        billingEmail: data.billingEmail,
        billingPhone: data.billingPhone,
        billingPec: data.billingPec,
        taxableInvoice: data.taxableInvoice === 'true',
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profileId))
      .returning({ userId: profiles.userId });

    const uid = updateResult[0]?.userId;
    if (uid) revalidateTag(`artist-manager:${uid}`, 'max');
    revalidateTag('artist-managers', 'max');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateArtistManagerBillingData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento profilo non riuscito.',
      data: null,
    };
  }
};
