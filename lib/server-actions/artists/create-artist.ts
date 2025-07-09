'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq, inArray } from 'drizzle-orm';
import {
  profiles,
  countries,
  languages as languagesTable,
  subdivisions,
  zones as zonesTable,
  users,
  artists,
  artistLanguages,
  managerArtists,
  artistZones,
} from '@/lib/database/schema';
import {
  artistFormSchema,
  ArtistFormSchema,
} from '@/lib/validation/artistFormSchema';

export const createArtist = async (
  data: ArtistFormSchema
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[createArtist] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[createArtist] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = artistFormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[createArtist] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const {
    languages,
    countryId,
    subdivisionId,
    billingCountry,
    billingSubdivisionId,
    zones,
    artistManagers,
  } = validation.data;

  try {
    const [
      languagesCheck,
      countryCheck,
      subdivisionCheck,
      billingCountryCheck,
      billingSubdivisionCheck,
      zonesCheck,
      artistManagersCheck,
    ] = await Promise.all([
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

      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, billingCountry.id)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, billingSubdivisionId)),

      database
        .select({ id: zonesTable.id })
        .from(zonesTable)
        .where(inArray(zonesTable.id, zones)),

      database
        .select({ id: profiles.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(
          and(
            eq(users.role, 'artist-manager'),
            inArray(profiles.id, artistManagers)
          )
        ),
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

    if (zonesCheck.length !== zonesCheck.length) {
      return {
        success: false,
        message: 'Una o più aree di interesse selezionate non valide.',
        data: null,
      };
    }

    if (artistManagersCheck.length !== artistManagersCheck.length) {
      return {
        success: false,
        message: 'Una o più manager selezionati non validi.',
        data: null,
      };
    }

    await database.transaction(async (tx) => {
      const artistResult = await tx
        .insert(artists)
        .values({
          status: 'active',

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
        .returning({ id: artists.id });

      const newArtistId = artistResult[0]?.id;
      if (!newArtistId) {
        return {
          success: false,
          message: 'Recupero id artista non riuscito.',
          data: null,
        };
      }

      const languageInserts = (data.languages || []).map(
        (languageId: number) => ({
          artistId: newArtistId,
          languageId,
        })
      );

      if (languageInserts.length > 0) {
        await tx.insert(artistLanguages).values(languageInserts);
      }

      const managerArtistsInserts = (data.artistManagers || []).map(
        (artistManagerId: number) => ({
          managerProfileId: artistManagerId,
          artistId: newArtistId,
        })
      );

      if (managerArtistsInserts.length > 0) {
        await tx.insert(managerArtists).values(managerArtistsInserts);
      }

      const artistZonesInserts = (data.zones || []).map((zoneId: number) => ({
        artistId: newArtistId,
        zoneId: zoneId,
      }));

      if (artistZonesInserts.length > 0) {
        await tx.insert(artistZones).values(artistZonesInserts);
      }
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[createArtist] transaction failed', error);
    return {
      success: false,
      message: 'Creazione artista non riuscita.',
      data: null,
    };
  }
};
