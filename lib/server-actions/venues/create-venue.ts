'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import {
  profiles,
  countries,
  subdivisions,
  users,
  venues,
} from '@/lib/database/schema';
import {
  venueFormSchema,
  VenueFormSchema,
} from '@/lib/validation/venueFormSchema';

export const createVenue = async (
  data: VenueFormSchema
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[createVenue] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[createVenue] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = venueFormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[createVenue] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const {
    countryId,
    subdivisionId,
    venueManagerId,
    billingCountry,
    billingSubdivisionId,
  } = validation.data;

  try {
    const [
      countryCheck,
      subdivisionCheck,
      billingCountryCheck,
      billingSubdivisionCheck,
      venueManagerCheck,
    ] = await Promise.all([
      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, countryId)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, subdivisionId)),

      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, billingCountry.id)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, billingSubdivisionId)),

      database
        .select({ id: profiles.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(
          and(eq(users.role, 'venue-manager'), eq(profiles.id, venueManagerId))
        ),
    ]);

    if (countryCheck.length !== 1) {
      return {
        success: false,
        message: 'Stato selezionato non valido.',
        data: null,
      };
    }

    if (billingCountryCheck.length !== 1) {
      return {
        success: false,
        message: 'Stato fatturazione selezionato non valido.',
        data: null,
      };
    }

    if (subdivisionCheck.length !== 1) {
      return {
        success: false,
        message: 'Provincia selezionata non valida.',
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

    if (subdivisionCheck[0].countryId != countryId) {
      return {
        success: false,
        message: 'La provincia selezionata non appartiene allo stato indicato.',
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

    if (venueManagerCheck.length !== 1) {
      return {
        success: false,
        message: 'Manager selezionato non valido.',
        data: null,
      };
    }

    await database.insert(venues).values({
      status: 'active',
      avatarUrl: validation.data.avatarUrl,
      name: validation.data.name,
      type: validation.data.type,
      capacity: validation.data.capacity,
      managerProfileId: validation.data.venueManagerId,

      address: validation.data.address,
      countryId: validation.data.countryId,
      subdivisionId: validation.data.subdivisionId,
      city: validation.data.city,
      zipCode: validation.data.zipCode,

      company: validation.data.company,
      taxCode: validation.data.taxCode,
      ipiCode: validation.data.ipiCode,
      bicCode: validation.data.bicCode,
      abaRoutingNumber: validation.data.abaRoutingNumber,
      iban: validation.data.iban,
      sdiRecipientCode: validation.data.sdiRecipientCode,
      billingAddress: validation.data.billingAddress,
      billingCountryId: validation.data.billingCountry.id,
      billingSubdivisionId: validation.data.billingSubdivisionId,
      billingCity: validation.data.billingCity,
      billingZipCode: validation.data.billingZipCode,
      billingEmail: validation.data.billingEmail,
      billingPhone: validation.data.billingPhone,
      billingPec: validation.data.billingPec,
      taxableInvoice: validation.data.taxableInvoice === 'true',

      tiktokUrl: validation.data.tiktokUrl || null,
      tiktokUsername: validation.data.tiktokUsername || null,
      tiktokFollowers: validation.data.tiktokFollowers || null,
      tiktokCreatedAt: validation.data.tiktokCreatedAt || null,

      facebookUrl: validation.data.facebookUrl || null,
      facebookUsername: validation.data.facebookUsername || null,
      facebookFollowers: validation.data.facebookFollowers || null,
      facebookCreatedAt: validation.data.facebookCreatedAt || null,

      instagramUrl: validation.data.instagramUrl || null,
      instagramUsername: validation.data.instagramUsername || null,
      instagramFollowers: validation.data.instagramFollowers || null,
      instagramCreatedAt: validation.data.instagramCreatedAt || null,

      xUrl: validation.data.xUrl || null,
      xUsername: validation.data.xUsername || null,
      xFollowers: validation.data.xFollowers || null,
      xCreatedAt: validation.data.xCreatedAt || null,
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[createVenue] transaction failed', error);
    return {
      success: false,
      message: 'Creazione locale non riuscita.',
      data: null,
    };
  }
};
