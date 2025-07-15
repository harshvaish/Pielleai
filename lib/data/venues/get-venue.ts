'use server';

import { database } from '@/lib/database/connection';
import {
  countries,
  subdivisions,
  profiles,
  venues,
  users,
} from '@/lib/database/schema';
import { VenueData } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export async function getVenue(slug: string): Promise<VenueData | null> {
  try {
    const country = alias(countries, 'country');
    const subdivision = alias(subdivisions, 'subdivision');
    const billingCountry = alias(countries, 'billingCountry');
    const billingSubdivision = alias(subdivisions, 'billingSubdivision');

    const venueResult = await database
      .select({
        id: venues.id,
        slug: venues.slug,
        artistId: venues.id,
        status: venues.status,
        createdAt: venues.createdAt,
        updatedAt: venues.updatedAt,

        avatarUrl: venues.avatarUrl,
        name: venues.name,
        capacity: venues.capacity,
        type: venues.type,

        manager: {
          id: profiles.userId,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
          status: users.status,
        },

        address: venues.address,
        country: {
          id: country.id,
          name: country.name,
          code: country.code,
          isEu: country.isEu,
        },
        subdivision: {
          id: subdivision.id,
          name: subdivision.name,
        },
        city: venues.city,
        zipCode: venues.zipCode,

        company: venues.company,
        taxCode: venues.taxCode,
        ipiCode: venues.ipiCode,
        bicCode: venues.bicCode,
        abaRoutingNumber: venues.abaRoutingNumber,
        iban: venues.iban,
        sdiRecipientCode: venues.sdiRecipientCode,
        billingAddress: venues.billingAddress,
        billingCountry: {
          id: billingCountry.id,
          name: billingCountry.name,
          code: billingCountry.code,
          isEu: billingCountry.isEu,
        },
        billingSubdivision: {
          id: billingSubdivision.id,
          name: billingSubdivision.name,
        },
        billingCity: venues.billingCity,
        billingZipCode: venues.billingZipCode,
        billingEmail: venues.billingEmail,
        billingPhone: venues.billingPhone,
        billingPec: venues.billingPec,
        taxableInvoice: venues.taxableInvoice,

        tiktokUrl: venues.tiktokUrl,
        tiktokUsername: venues.tiktokUsername,
        tiktokFollowers: venues.tiktokFollowers,
        tiktokCreatedAt: venues.tiktokCreatedAt,

        facebookUrl: venues.facebookUrl,
        facebookUsername: venues.facebookUsername,
        facebookFollowers: venues.facebookFollowers,
        facebookCreatedAt: venues.facebookCreatedAt,

        instagramUrl: venues.instagramUrl,
        instagramUsername: venues.instagramUsername,
        instagramFollowers: venues.instagramFollowers,
        instagramCreatedAt: venues.instagramCreatedAt,

        xUrl: venues.xUrl,
        xUsername: venues.xUsername,
        xFollowers: venues.xFollowers,
        xCreatedAt: venues.xCreatedAt,
      })
      .from(venues)
      .innerJoin(profiles, eq(venues.managerProfileId, profiles.id))
      .innerJoin(users, eq(profiles.userId, users.id))
      .innerJoin(country, eq(venues.countryId, country.id))
      .innerJoin(subdivision, eq(venues.subdivisionId, subdivision.id))
      .innerJoin(billingCountry, eq(venues.billingCountryId, billingCountry.id))
      .innerJoin(
        billingSubdivision,
        eq(venues.billingSubdivisionId, billingSubdivision.id)
      )
      .where(eq(venues.slug, slug))
      .limit(1);

    if (!venueResult.length) return null;

    return venueResult[0];
  } catch (error) {
    console.error('[getVenue] - Error:', error);
    throw new Error('Recupero dati locale non riuscito.');
  }
}
