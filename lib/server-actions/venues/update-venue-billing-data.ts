'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { countries, subdivisions, venues } from '@/lib/database/schema';
import { venueS2FormSchema, VenueS2FormSchema } from '@/lib/validation/venue-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';

export const updateVenueBillingData = async (
  venueId: number,
  data: VenueS2FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[updateVenueBillingData] - Error: unauthorized', session);
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
      .update(venues)
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
      .where(eq(venues.id, venueId))
      .returning({ slug: venues.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`);
    revalidateTag('venues');

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
