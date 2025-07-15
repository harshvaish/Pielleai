'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { countries, subdivisions, venues } from '@/lib/database/schema';
import {
  venueS2FormSchema,
  VenueS2FormSchema,
} from '@/lib/validation/venueFormSchema';

export const editVenueBillingData = async ({
  venueId,
  data,
}: {
  venueId: number;
  data: VenueS2FormSchema;
}): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[editVenueBillingData] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[editVenueBillingData] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = venueS2FormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[editVenueBillingData] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const { billingCountry, billingSubdivisionId } = validation.data;

  try {
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
      return {
        success: false,
        message: 'Stato fatturazione selezionato non valido.',
        data: null,
      };
    }

    if (billingSubdivisionCheck.length !== 1) {
      return {
        success: false,
        message: 'Provincia fatturazione selezionata non valida.',
        data: null,
      };
    }

    if (billingSubdivisionCheck[0].countryId != billingCountry.id) {
      return {
        success: false,
        message:
          'La provincia fatturazione non appartiene allo stato fatturazione selezionato.',
        data: null,
      };
    }

    await database
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
      .where(eq(venues.id, venueId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[editVenueBillingData] transaction failed', error);
    return {
      success: false,
      message: 'Aggiornamento scheda locale non riuscito.',
      data: null,
    };
  }
};
