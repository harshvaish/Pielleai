'server only';

import { database } from '@/lib/database/connection';
import { countries, subdivisions, profiles, venues, users } from '@/lib/database/schema';
import { VenueData, VenueManagerSelectData } from '@/lib/types';
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
        bio: venues.bio,
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
        vatCode: venues.vatCode,
        bicCode: venues.bicCode,
        abaRoutingNumber: venues.abaRoutingNumber,
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
      .leftJoin(profiles, eq(venues.managerProfileId, profiles.id))
      .leftJoin(users, eq(profiles.userId, users.id))
      .leftJoin(country, eq(venues.countryId, country.id))
      .leftJoin(subdivision, eq(venues.subdivisionId, subdivision.id))
      .leftJoin(billingCountry, eq(venues.billingCountryId, billingCountry.id))
      .leftJoin(billingSubdivision, eq(venues.billingSubdivisionId, billingSubdivision.id))
      .where(eq(venues.slug, slug))
      .limit(1);
     
    if (!venueResult.length) return null;

    const normalizedVenue = {
      ...venueResult[0],
      manager: venueResult[0].manager?.id
        ? (venueResult[0].manager as VenueManagerSelectData)
        : null,
      country: venueResult[0].country?.id ? venueResult[0].country : null,
      subdivision: venueResult[0].subdivision?.id ? venueResult[0].subdivision : null,
      billingCountry: venueResult[0].billingCountry?.id ? venueResult[0].billingCountry : null,
      billingSubdivision: venueResult[0].billingSubdivision?.id ? venueResult[0].billingSubdivision : null,
    };

    return normalizedVenue;
  } catch (error) {
    console.error('[getVenue] - Error:', error);
    throw new Error('Recupero dati locale non riuscito.');
  }
}
