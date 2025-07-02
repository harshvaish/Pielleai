'server only';

import { database } from '@/lib/database/connection';
import {
  languages,
  profileLanguages,
  profiles,
  users,
} from '@/lib/database/schema';
import { ArtistsManagerData } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function getArtistManager(
  uid: string
): Promise<ArtistsManagerData | null> {
  try {
    // Get main user and profile data
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
        countryId: profiles.countryId,
        subdivisionId: profiles.subdivisionId,
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
        billingCountryId: profiles.billingCountryId,
        billingSubdivisionId: profiles.billingSubdivisionId,
        billingCity: profiles.billingCity,
        billingZipCode: profiles.billingZipCode,
        billingEmail: profiles.billingEmail,
        billingPhone: profiles.billingPhone,
        billingPec: profiles.billingPec,
        taxableInvoice: profiles.taxableInvoice,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.id, uid))
      .limit(1);

    if (!userResult.length) return null;

    const user = userResult[0];

    // Get languages separately
    const languagesResult = await database
      .select({ id: languages.id, name: languages.name })
      .from(profileLanguages)
      .innerJoin(languages, eq(profileLanguages.languageId, languages.id))
      .where(eq(profileLanguages.profileId, user.profileId));

    const languageIds = languagesResult.map((lang) => lang.id);

    return {
      ...user,
      languages: languageIds,
    };
  } catch (error) {
    console.error('[getArtistManagerData] - Error:', error);
    throw new Error('Recupero dati manager artisti non riuscito.');
  }
}
