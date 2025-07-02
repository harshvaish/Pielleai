'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import {
  ArtistManagerS1FormSchema,
  artistManagerFormS1Schema,
} from '@/lib/validation/artistManagerFormSchema';
import { database } from '@/lib/database/connection';
import { eq, inArray } from 'drizzle-orm';
import {
  profileLanguages,
  profiles,
  countries,
  languages as languagesTable,
  subdivisions,
} from '@/lib/database/schema';

export const editArtistManagerPersonalData = async ({
  profileId,
  data,
}: {
  profileId: number;
  data: ArtistManagerS1FormSchema;
}): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error(
        '[editArtistManagerPersonalData] - Error: unauthorized',
        session
      );
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[editArtistManagerPersonalData] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = artistManagerFormS1Schema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[editArtistsManager] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const { languages, countryId, subdivisionId } = validation.data;

  try {
    const [languagesCheck, countryCheck, subdivisionCheck] = await Promise.all([
      database
        .select({ id: languagesTable.id })
        .from(languagesTable)
        .where(inArray(languagesTable.id, languages)),

      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, countryId)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, subdivisionId)),
    ]);

    if (languagesCheck.length !== languages.length) {
      return {
        success: false,
        message: 'Una o più lingue selezionate non valide.',
        data: null,
      };
    }

    if (countryCheck.length !== 1) {
      return {
        success: false,
        message: 'Stato selezionato non valido.',
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

    if (subdivisionCheck[0].countryId != countryId) {
      return {
        success: false,
        message: 'La provincia selezionata non appartiene allo stato indicato.',
        data: null,
      };
    }

    await database.transaction(async (tx) => {
      await tx
        .update(profiles)
        .set({
          avatarUrl: data.avatarUrl,
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          birthDate: data.birthDate,
          birthPlace: data.birthPlace,
          gender: data.gender,
          address: data.address,
          countryId: data.countryId,
          subdivisionId: data.subdivisionId,
          city: data.city,
          zipCode: data.zipCode,
        })
        .where(eq(profiles.id, profileId));

      // First delete existing languages
      await tx
        .delete(profileLanguages)
        .where(eq(profileLanguages.profileId, profileId));

      // Then insert new ones
      const languageInserts = (data.languages || []).map(
        (languageId: number) => ({
          profileId,
          languageId,
        })
      );

      if (languageInserts.length > 0) {
        await tx.insert(profileLanguages).values(languageInserts);
      }
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[editArtistManagerPersonalData] transaction failed', error);
    return {
      success: false,
      message: 'Aggiornamento profilo non riuscito.',
      data: null,
    };
  }
};
