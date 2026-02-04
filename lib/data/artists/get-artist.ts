'server only';

import { database } from '@/lib/database/connection';
import {
  artistLanguages,
  artists,
  artistZones,
  countries,
  languages,
  subdivisions,
  zones,
  managerArtists,
  profiles,
  users,
} from '@/lib/database/schema';
import { ArtistData } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export async function getArtist(slug: string): Promise<ArtistData | null> {
  try {
    const country = alias(countries, 'country');
    const subdivision = alias(subdivisions, 'subdivision');
    const billingCountry = alias(countries, 'billingCountry');
    const billingSubdivision = alias(subdivisions, 'billingSubdivision');

    const userResult = await database
      .select({
        id: artists.id,
        slug: artists.slug,
        artistId: artists.id,
        status: artists.status,
        createdAt: artists.createdAt,
        updatedAt: artists.updatedAt,

        avatarUrl: artists.avatarUrl,
        name: artists.name,
        surname: artists.surname,
        stageName: artists.stageName,
        bio: artists.bio,
        categories: artists.categories,
        capacityCategory: artists.capacityCategory,
        phone: artists.phone,
        email: artists.email,
        birthDate: artists.birthDate,
        birthPlace: artists.birthPlace,
        gender: artists.gender,

        tourManagerEmail: artists.tourManagerEmail,
        tourManagerName: artists.tourManagerName,
        tourManagerSurname: artists.tourManagerSurname,
        tourManagerPhone: artists.tourManagerPhone,

        address: artists.address,
        addressFormatted: artists.addressFormatted,
        streetName: artists.streetName,
        streetNumber: artists.streetNumber,
        placeId: artists.placeId,
        latitude: artists.latitude,
        longitude: artists.longitude,
        countryName: artists.countryName,
        countryCode: artists.countryCode,
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
        city: artists.city,
        zipCode: artists.zipCode,

        company: artists.company,
        taxCode: artists.taxCode,
        taxCodeFileUrl: artists.taxCodeFileUrl,
        taxCodeFileName: artists.taxCodeFileName,
        idCardFileUrl: artists.idCardFileUrl,
        idCardFileName: artists.idCardFileName,
        passportFileUrl: artists.passportFileUrl,
        passportFileName: artists.passportFileName,
        ipiCode: artists.ipiCode,
        bicCode: artists.bicCode,
        abaRoutingNumber: artists.abaRoutingNumber,
        iban: artists.iban,
        sdiRecipientCode: artists.sdiRecipientCode,
        billingAddress: artists.billingAddress,
        billingAddressFormatted: artists.billingAddressFormatted,
        billingStreetName: artists.billingStreetName,
        billingStreetNumber: artists.billingStreetNumber,
        billingPlaceId: artists.billingPlaceId,
        billingLatitude: artists.billingLatitude,
        billingLongitude: artists.billingLongitude,
        billingCountryName: artists.billingCountryName,
        billingCountryCode: artists.billingCountryCode,
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
        billingCity: artists.billingCity,
        billingZipCode: artists.billingZipCode,
        billingEmail: artists.billingEmail,
        billingPhone: artists.billingPhone,
        billingPec: artists.billingPec,
        taxableInvoice: artists.taxableInvoice,

        tiktokUrl: artists.tiktokUrl,
        tiktokUsername: artists.tiktokUsername,
        tiktokFollowers: artists.tiktokFollowers,
        tiktokCreatedAt: artists.tiktokCreatedAt,

        facebookUrl: artists.facebookUrl,
        facebookUsername: artists.facebookUsername,
        facebookFollowers: artists.facebookFollowers,
        facebookCreatedAt: artists.facebookCreatedAt,

        instagramUrl: artists.instagramUrl,
        instagramUsername: artists.instagramUsername,
        instagramFollowers: artists.instagramFollowers,
        instagramCreatedAt: artists.instagramCreatedAt,

        xUrl: artists.xUrl,
        xUsername: artists.xUsername,
        xFollowers: artists.xFollowers,
        xCreatedAt: artists.xCreatedAt,
      })
      .from(artists)
      .leftJoin(country, eq(artists.countryId, country.id))
      .leftJoin(subdivision, eq(artists.subdivisionId, subdivision.id))
      .leftJoin(billingCountry, eq(artists.billingCountryId, billingCountry.id))
      .leftJoin(billingSubdivision, eq(artists.billingSubdivisionId, billingSubdivision.id))
      .where(eq(artists.slug, slug))
      .groupBy(artists.id, country.id, subdivision.id, billingCountry.id, billingSubdivision.id)
      .limit(1);

    if (!userResult.length) return null;

    const user = {
      ...userResult[0],
      country: userResult[0].country?.id ? userResult[0].country : null,
      subdivision: userResult[0].subdivision?.id ? userResult[0].subdivision : null,
      billingCountry: userResult[0].billingCountry?.id ? userResult[0].billingCountry : null,
      billingSubdivision: userResult[0].billingSubdivision?.id ? userResult[0].billingSubdivision : null,
      categories: userResult[0].categories ?? [],
    };

    const [zonesResult, languagesResult, managersResult] = await Promise.all([
      database
        .select({
          id: zones.id,
          name: zones.name,
        })
        .from(artistZones)
        .innerJoin(zones, eq(artistZones.zoneId, zones.id))
        .where(eq(artistZones.artistId, user.artistId)),

      database
        .select({ id: languages.id, name: languages.name })
        .from(artistLanguages)
        .innerJoin(languages, eq(artistLanguages.languageId, languages.id))
        .where(eq(artistLanguages.artistId, user.artistId)),

      database
        .select({
          id: profiles.userId,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
          status: users.status,
        })
        .from(managerArtists)
        .innerJoin(profiles, eq(managerArtists.managerProfileId, profiles.id))
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(eq(managerArtists.artistId, user.artistId)),
    ]);

    return {
      ...user,
      zones: zonesResult,
      languages: languagesResult,
      managers: managersResult,
    };
  } catch (error) {
    console.error('[getArtist] - Error:', error);
    throw new Error('Recupero dati artista non riuscito.');
  }
}
