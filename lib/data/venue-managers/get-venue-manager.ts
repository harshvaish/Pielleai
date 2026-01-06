'server only';

import { database } from '@/lib/database/connection';
import { countries, languages, profileLanguages, profiles, subdivisions, users, venues } from '@/lib/database/schema';
import { Language, VenueListData, VenueManagerData } from '@/lib/types';
import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export async function getVenueManager(uid: string): Promise<VenueManagerData<VenueListData> | null> {
  try {
    const country = alias(countries, 'country');
    const subdivision = alias(subdivisions, 'subdivision');

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
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .leftJoin(country, eq(profiles.countryId, country.id))
      .leftJoin(subdivision, eq(profiles.subdivisionId, subdivision.id))
      .where(eq(users.id, uid))
      .orderBy(desc(profiles.createdAt))
      .limit(1);

    if (!userResult.length) return null;

    const user = {
      ...userResult[0],
      country: userResult[0].country?.id ? userResult[0].country : null,
      subdivision: userResult[0].subdivision?.id ? userResult[0].subdivision : null,
    };

    const [languagesResult, venuesResult]: [Language[], VenueListData[]] = await Promise.all([
      database
        .select({ id: languages.id, name: languages.name })
        .from(profileLanguages)
        .innerJoin(languages, eq(profileLanguages.languageId, languages.id))
        .where(eq(profileLanguages.profileId, user.profileId)),

      database
        .select({
          id: venues.id,
          status: venues.status,
          slug: venues.slug,
          avatarUrl: venues.avatarUrl,
          type: venues.type,
          name: venues.name,
          address: venues.address,
          company: venues.company,
          taxCode: venues.taxCode,
          capacity: venues.capacity,
          vatCode: venues.vatCode
        })
        .from(venues)
        .where(eq(venues.managerProfileId, user.profileId)),
    ]);

    return {
      ...user,
      languages: languagesResult,
      venues: venuesResult,
    };
  } catch (error) {
    console.error('[getVenueManager] - Error:', error);
    throw new Error('Recupero dati promoter locali non riuscito.');
  }
}
