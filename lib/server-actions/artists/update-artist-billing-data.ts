'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { countries, subdivisions, artists } from '@/lib/database/schema';
import { artistS2FormSchema, ArtistS2FormSchema } from '@/lib/validation/artist-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { hasRole } from '@/lib/utils';

export const updateArtistBillingData = async (
  artistId: number,
  data: ArtistS2FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      console.error('[createArtist] - Error: unauthorized', session);
      throw new AppError('Devi essere autenticato.');
    }

    if (!hasRole(session.user, ['admin', 'artist-manager'])) {
      console.error('[createArtist] - Error: role', session);
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
      throw new AppError('Stato fatturazione selezionato non valido.');
    }

    if (billingSubdivisionCheck.length !== 1) {
      throw new AppError('Provincia fatturazione selezionata non valida.');
    }

    if (billingSubdivisionCheck[0].countryId != billingCountry.id) {
      throw new AppError(
        'La provincia fatturazione non appartiene allo stato fatturazione selezionato.',
      );
    }

    const updateResult = await database
      .update(artists)
      .set({
        company: validation.data.company,
        taxCode: validation.data.taxCode,
        ipiCode: validation.data.ipiCode,
        bicCode: validation.data.bicCode || null,
        abaRoutingNumber: validation.data.abaRoutingNumber || null,
        iban: validation.data.iban,
        sdiRecipientCode: validation.data.sdiRecipientCode || null,
        billingAddress: validation.data.billingAddress,
        billingCountryId: validation.data.billingCountry.id,
        billingSubdivisionId: validation.data.billingSubdivisionId,
        billingCity: validation.data.billingCity,
        billingZipCode: validation.data.billingZipCode,
        billingEmail: validation.data.billingEmail,
        billingPhone: validation.data.billingPhone,
        billingPec: validation.data.billingPec,
        taxableInvoice: validation.data.taxableInvoice === 'true',
        updatedAt: new Date(),
      })
      .where(eq(artists.id, artistId))
      .returning({ slug: artists.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`artist:${slug}`);
    revalidateTag('artists');

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
