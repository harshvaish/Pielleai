'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import {
  ArtistManagerS2FormSchema,
  artistManagerFormS2Schema,
} from '@/lib/validation/artistManagerFormSchema';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';
import { profiles, countries, subdivisions } from '@/lib/database/schema';

export const editArtistManagerBillingData = async ({
  profileId,
  data,
}: {
  profileId: number;
  data: ArtistManagerS2FormSchema;
}): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error(
        '[editArtistManagerBillingData] - Error: unauthorized',
        session
      );
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[editArtistManagerBillingData] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = artistManagerFormS2Schema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[editArtistManagerBillingData] - Error: validation failed',
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
      .where(eq(profiles.id, profileId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[editArtistManagerBillingData] transaction failed', error);
    return {
      success: false,
      message: 'Aggiornamento profilo non riuscito.',
      data: null,
    };
  }
};
