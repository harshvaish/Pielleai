'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { countries, subdivisions, artists } from '@/lib/database/schema';
import { artistS2FormSchema, ArtistS2FormSchema } from '@/lib/validation/artist-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { hasRole } from '@/lib/utils';
import getSession from '@/lib/data/auth/get-session';

export const updateArtistBillingData = async (
  artistId: number,
  data: ArtistS2FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateArtistBillingData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      console.error('[updateArtistBillingData] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = artistS2FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateArtistBillingData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { billingCountry, billingSubdivisionId } = validation.data;

    const [billingCountryCheck, billingSubdivisionCheck] = await Promise.all([
      billingCountry
        ? database
            .select({ id: countries.id })
            .from(countries)
            .where(eq(countries.id, billingCountry.id))
        : null,

      billingSubdivisionId
        ? database
            .select({ id: subdivisions.id, countryId: subdivisions.countryId })
            .from(subdivisions)
            .where(eq(subdivisions.id, billingSubdivisionId))
        : null,
    ]);

    if (billingCountryCheck && billingCountryCheck.length !== 1) {
      throw new AppError('Nazione selezionata non valida.');
    }

    if (billingSubdivisionCheck && billingSubdivisionCheck.length !== 1) {
      throw new AppError('Provincia di fatturazione selezionata non valida.');
    }

    if (
      billingSubdivisionCheck &&
      billingCountry &&
      billingSubdivisionCheck[0].countryId != billingCountry.id
    ) {
      throw new AppError('La provincia di fatturazione non appartiene alla nazione selezionata.');
    }

    const updateResult = await database
      .update(artists)
      .set({
        company: validation.data.company || null,
        taxCode: validation.data.taxCode || null,
        ipiCode: validation.data.ipiCode || null,
        bicCode: validation.data.bicCode || null,
        abaRoutingNumber: validation.data.abaRoutingNumber || null,
        iban: validation.data.iban || null,
        sdiRecipientCode: validation.data.sdiRecipientCode || null,
        billingAddress: validation.data.billingAddress || null,
        billingAddressFormatted: validation.data.billingAddressFormatted ?? null,
        billingStreetName: validation.data.billingStreetName ?? null,
        billingStreetNumber: validation.data.billingStreetNumber ?? null,
        billingPlaceId: validation.data.billingPlaceId ?? null,
        billingLatitude: validation.data.billingLatitude ? validation.data.billingLatitude : null,
        billingLongitude: validation.data.billingLongitude ? validation.data.billingLongitude : null,
        billingCountryName: validation.data.billingCountryName ?? null,
        billingCountryCode: validation.data.billingCountryCode ?? null,
        billingCountryId: validation.data.billingCountry?.id || null,
        billingSubdivisionId: validation.data.billingSubdivisionId || null,
        billingCity: validation.data.billingCity || null,
        billingZipCode: validation.data.billingZipCode || null,
        billingEmail: validation.data.billingEmail || null,
        billingPhone: validation.data.billingPhone || null,
        billingPec: validation.data.billingPec || null,
        taxableInvoice: validation.data.taxableInvoice === 'true',
        updatedAt: new Date(),
      })
      .where(eq(artists.id, artistId))
      .returning({ slug: artists.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`artist:${slug}`, 'max');
    revalidateTag('artists', 'max');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateArtistBillingData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento profilo non riuscito.',
      data: null,
    };
  }
};
