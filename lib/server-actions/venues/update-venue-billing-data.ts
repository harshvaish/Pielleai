'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { countries, subdivisions, venues } from '@/lib/database/schema';
import { venueS2FormSchema, VenueS2FormSchema } from '@/lib/validation/venue-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';

export const updateVenueBillingData = async (
  venueId: number,
  data: VenueS2FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateVenueBillingData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'venue-manager'])) {
      console.error('[updateVenueBillingData] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = venueS2FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateVenueBillingData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('Dati inviati non corretti.');
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
      .update(venues)
      .set({
        company: validation.data.company,
        taxCode: validation.data.taxCode,
        vatCode: validation.data.vatCode,
        bicCode: validation.data.bicCode || null,
        abaRoutingNumber: validation.data.abaRoutingNumber || null,
        sdiRecipientCode: validation.data.sdiRecipientCode || null,
        billingAddress: validation.data.billingAddress,
        billingCountryId: validation.data.billingCountry.id,
        billingSubdivisionId: validation.data.billingSubdivisionId,
        billingCity: validation.data.billingCity,
        billingZipCode: validation.data.billingZipCode,
        billingEmail: validation.data.billingEmail || null,
        billingPhone: validation.data.billingPhone || null,
        billingPec: validation.data.billingPec,
        updatedAt: new Date(),
      })
      .where(eq(venues.id, venueId))
      .returning({ slug: venues.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`, 'max');
    revalidateTag('venues', 'max');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateVenueBillingData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento locale non riuscito.',
      data: null,
    };
  }
};
