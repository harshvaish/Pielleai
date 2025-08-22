'server only';

import { database } from '@/lib/database/connection';
import { artists, countries, languages, managerArtists, profileLanguages, profiles, subdivisions, users } from '@/lib/database/schema';
import { ArtistListData, ArtistManagerData, Language } from '@/lib/types';
import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export async function getArtistManager(uid: string): Promise<ArtistManagerData<ArtistListData> | null> {
  try {
    const country = alias(countries, 'country');
    const subdivision = alias(subdivisions, 'subdivision');
    const billingCountry = alias(countries, 'billingCountry');
    const billingSubdivision = alias(subdivisions, 'billingSubdivision');

    const userResult = await database
      .select({
        id: users.id,
        profileId: profiles.id,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,

        avatarUrl: profiles.avatarUrl,
        name: profiles.name,
        surname: profiles.surname,
        phone: profiles.phone,
        email: users.email,
        birthDate: profiles.birthDate,
        birthPlace: profiles.birthPlace,
        address: profiles.address,
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
        city: profiles.city,
        zipCode: profiles.zipCode,
        gender: profiles.gender,

        company: profiles.company,
        taxCode: profiles.taxCode,
        ipiCode: profiles.ipiCode,
        bicCode: profiles.bicCode,
        abaRoutingNumber: profiles.abaRoutingNumber,
        iban: profiles.iban,
        sdiRecipientCode: profiles.sdiRecipientCode,
        billingAddress: profiles.billingAddress,
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
        billingCity: profiles.billingCity,
        billingZipCode: profiles.billingZipCode,
        billingEmail: profiles.billingEmail,
        billingPhone: profiles.billingPhone,
        billingPec: profiles.billingPec,
        taxableInvoice: profiles.taxableInvoice,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .innerJoin(country, eq(profiles.countryId, country.id))
      .innerJoin(subdivision, eq(profiles.subdivisionId, subdivision.id))
      .innerJoin(billingCountry, eq(profiles.billingCountryId, billingCountry.id))
      .innerJoin(billingSubdivision, eq(profiles.billingSubdivisionId, billingSubdivision.id))
      .orderBy(desc(profiles.createdAt))
      .where(eq(users.id, uid))
      .limit(1);

    if (!userResult.length) return null;

    const user = userResult[0];

    const [languagesResult, artistsResult]: [Language[], ArtistListData[]] = await Promise.all([
      database
        .select({ id: languages.id, name: languages.name })
        .from(profileLanguages)
        .innerJoin(languages, eq(profileLanguages.languageId, languages.id))
        .where(eq(profileLanguages.profileId, user.profileId)),

      database
        .select({
          id: artists.id,
          status: artists.status,
          slug: artists.slug,
          avatarUrl: artists.avatarUrl,
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
          phone: artists.phone,
          email: artists.email,
          tourManagerEmail: artists.tourManagerEmail,
          tourManagerName: artists.tourManagerName,
          tourManagerSurname: artists.tourManagerSurname,
          tourManagerPhone: artists.tourManagerPhone,
        })
        .from(managerArtists)
        .innerJoin(artists, eq(managerArtists.artistId, artists.id))
        .where(eq(managerArtists.managerProfileId, user.profileId)),
    ]);

    return {
      ...user,
      languages: languagesResult,
      artists: artistsResult,

      company: user.company || '',
      taxCode: user.taxCode || '',
      ipiCode: user.ipiCode || '',
      iban: user.iban || '',
      billingAddress: user.billingAddress || '',
      billingCity: user.billingCity || '',
      billingZipCode: user.billingZipCode || '',
      billingEmail: user.billingEmail || '',
      billingPhone: user.billingPhone || '',
      billingPec: user.billingPec || '',
      taxableInvoice: user.taxableInvoice || false,
    }; // nullable fields in the database have guard protection
  } catch (error) {
    console.error('[getArtistManagerData] - Error:', error);
    throw new Error('Recupero dati manager artisti non riuscito.');
  }
}
