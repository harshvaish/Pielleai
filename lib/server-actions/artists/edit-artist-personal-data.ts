'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq, inArray } from 'drizzle-orm';
import { profiles, countries, languages as languagesTable, subdivisions, zones as zonesTable, users, artists, artistLanguages, managerArtists, artistZones } from '@/lib/database/schema';
import { artistS1FormSchema, ArtistS1FormSchema } from '@/lib/validation/artistFormSchema';
import { areSame } from '@/lib/utils';

export const editArtistPersonalData = async ({ artistId, data }: { artistId: number; data: ArtistS1FormSchema }): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[editArtistPersonalData] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[editArtistPersonalData] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = artistS1FormSchema.safeParse(data);

  if (!validation.success) {
    console.error('[editArtistPersonalData] - Error: validation failed', validation.error.issues[0]);
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const { languages, countryId, subdivisionId, zones, artistManagers } = validation.data;

  try {
    const [languagesCheck, countryCheck, subdivisionCheck, zonesCheck] = await Promise.all([
      database.select({ id: languagesTable.id }).from(languagesTable).where(inArray(languagesTable.id, languages)),

      database.select({ id: countries.id }).from(countries).where(eq(countries.id, countryId)),

      database.select({ id: subdivisions.id, countryId: subdivisions.countryId }).from(subdivisions).where(eq(subdivisions.id, subdivisionId)),

      database.select({ id: zonesTable.id }).from(zonesTable).where(inArray(zonesTable.id, zones)),
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

    if (zonesCheck.length !== zones.length) {
      return {
        success: false,
        message: 'Una o più aree di interesse selezionate non valide.',
        data: null,
      };
    }

    if (artistManagers.length > 0) {
      const artistManagersCheck = await database
        .select({ id: profiles.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(and(eq(users.role, 'artist-manager'), inArray(profiles.id, artistManagers)));

      if (artistManagersCheck.length !== artistManagers.length) {
        return {
          success: false,
          message: 'Una o più manager selezionati non validi.',
          data: null,
        };
      }
    }

    const [existingLanguages, existingZones, existingManagers] = await Promise.all([
      database.select({ languageId: artistLanguages.languageId }).from(artistLanguages).where(eq(artistLanguages.artistId, artistId)),
      database.select({ zoneId: artistZones.zoneId }).from(artistZones).where(eq(artistZones.artistId, artistId)),
      database.select({ managerProfileId: managerArtists.managerProfileId }).from(managerArtists).where(eq(managerArtists.artistId, artistId)),
    ]);

    const existingLanguageIds = existingLanguages.map((l) => l.languageId);
    const existingZoneIds = existingZones.map((z) => z.zoneId);
    const existingManagerIds = existingManagers.map((m) => m.managerProfileId);

    await database.transaction(async (tx) => {
      await tx
        .update(artists)
        .set({
          avatarUrl: validation.data.avatarUrl,
          name: validation.data.name,
          surname: validation.data.surname,
          stageName: validation.data.stageName,
          email: validation.data.email,
          phone: validation.data.phone,
          birthDate: validation.data.birthDate,
          birthPlace: validation.data.birthPlace,
          gender: validation.data.gender,
          address: validation.data.address,
          countryId: validation.data.countryId,
          subdivisionId: validation.data.subdivisionId,
          city: validation.data.city,
          zipCode: validation.data.zipCode,
          tourManagerName: validation.data.tourManagerName,
          tourManagerSurname: validation.data.tourManagerSurname,
          tourManagerEmail: validation.data.tourManagerEmail,
          tourManagerPhone: validation.data.tourManagerPhone,
          updatedAt: new Date(),
        })
        .where(eq(artists.id, artistId));

      if (!areSame(existingLanguageIds, validation.data.languages)) {
        await tx.delete(artistLanguages).where(eq(artistLanguages.artistId, artistId));
        if (validation.data.languages.length > 0) {
          await tx.insert(artistLanguages).values(
            validation.data.languages.map((languageId) => ({
              artistId,
              languageId,
            }))
          );
        }
      }

      if (!areSame(existingZoneIds, validation.data.zones)) {
        await tx.delete(artistZones).where(eq(artistZones.artistId, artistId));
        if (validation.data.zones.length > 0) {
          await tx.insert(artistZones).values(validation.data.zones.map((zoneId) => ({ artistId, zoneId })));
        }
      }

      if (!areSame(existingManagerIds, artistManagers)) {
        await tx.delete(managerArtists).where(eq(managerArtists.artistId, artistId));
        if (artistManagers.length > 0) {
          await tx.insert(managerArtists).values(
            artistManagers.map((managerProfileId) => ({
              artistId,
              managerProfileId,
            }))
          );
        }
      }
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[editArtistPersonalData] transaction failed', error);
    return {
      success: false,
      message: 'Aggiornamento artista non riuscito.',
      data: null,
    };
  }
};
