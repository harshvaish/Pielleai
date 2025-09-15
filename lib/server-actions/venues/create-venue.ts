'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { profiles, countries, subdivisions, users, venues } from '@/lib/database/schema';
import { venueFormSchema, VenueFormSchema } from '@/lib/validation/venue-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';

export const createVenue = async (data: VenueFormSchema): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createVenue] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'venue-manager'])) {
      console.error('[createVenue] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = venueFormSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createVenue] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { countryId, subdivisionId, venueManagerId, billingCountry, billingSubdivisionId } =
      validation.data;

    const [
      countryCheck,
      subdivisionCheck,
      billingCountryCheck,
      billingSubdivisionCheck,
      venueManagerCheck,
    ] = await Promise.all([
      database.select({ id: countries.id }).from(countries).where(eq(countries.id, countryId)),

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
        .where(and(eq(users.role, 'venue-manager'), eq(profiles.id, venueManagerId))),
    ]);

    if (countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (billingCountryCheck.length !== 1) {
      throw new AppError('Stato fatturazione selezionato non valido.');
    }

    if (subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (billingSubdivisionCheck.length !== 1) {
      throw new AppError('Provincia fatturazione selezionata non valida.');
    }

    if (subdivisionCheck[0].countryId != countryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
    }

    if (billingSubdivisionCheck[0].countryId != billingCountry.id) {
      throw new AppError(
        'La provincia fatturazione non appartiene allo stato fatturazione selezionato.',
      );
    }

    if (venueManagerCheck.length !== 1) {
      throw new AppError('Manager selezionato non valido.');
    }

    const venueResult = await database
      .insert(venues)
      .values({
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
      })
      .returning({ slug: venues.slug });

    const slug = venueResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`);
    revalidateTag('venues');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[createVenue] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Creazione locale non riuscita.',
      data: null,
    };
  }
};
