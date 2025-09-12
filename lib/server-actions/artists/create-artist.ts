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
import { artistFormSchema, ArtistFormSchema } from '@/lib/validation/artist-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { hasRole } from '@/lib/utils';

export const createArtist = async (data: ArtistFormSchema): Promise<ServerActionResponse<null>> => {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      console.error('[createArtist] - Error: unauthorized', session);
      throw new AppError('Devi essere autenticato.');
    }

    if (!hasRole(session.user, ['admin', 'artist-manager'])) {
      console.error('[createArtist] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = artistFormSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createArtist] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('I dati inviati non sono corretti.');
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

    const [
      languagesCheck,
      countryCheck,
      subdivisionCheck,
      billingCountryCheck,
      billingSubdivisionCheck,
      zonesCheck,
    ] = await Promise.all([
      database
        .select({ id: languagesTable.id })
        .from(languagesTable)
        .where(inArray(languagesTable.id, languages)),

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

      database.select({ id: zonesTable.id }).from(zonesTable).where(inArray(zonesTable.id, zones)),
    ]);

    if (languagesCheck.length !== languages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

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
      throw new AppError('La provincia selezionata non appartiene allo stato indicato');
    }

    if (billingSubdivisionCheck[0].countryId != billingCountry.id) {
      throw new AppError(
        'La provincia fatturazione non appartiene allo stato fatturazione selezionato.',
      );
    }

    if (zonesCheck.length !== zones.length) {
      throw new AppError('Una o più aree di interesse selezionate non valide.');
    }

    if (artistManagers.length > 0) {
      const artistManagersCheck = await database
        .select({ id: profiles.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(and(eq(users.role, 'artist-manager'), inArray(profiles.id, artistManagers)));

      if (artistManagersCheck.length !== artistManagers.length) {
        throw new AppError('Una o più manager selezionati non validi.');
      }
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
        .returning({ id: artists.id, slug: artists.slug });

      const newArtistId = artistResult[0]?.id;
      if (!newArtistId) {
        throw new AppError('Recupero id artista non riuscito.');
      }

      const slug = artistResult[0]?.slug;
      if (slug) revalidateTag(`artist:${slug}`);
      revalidateTag('artists');

      const languageInserts = (data.languages || []).map((languageId: number) => ({
        artistId: newArtistId,
        languageId,
      }));

      if (languageInserts.length > 0) {
        await tx.insert(artistLanguages).values(languageInserts);
      }

      const managerArtistsInserts = (data.artistManagers || []).map((artistManagerId: number) => ({
        managerProfileId: artistManagerId,
        artistId: newArtistId,
      }));

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
    console.error('[createArtist] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Creazione artista non riuscita.',
      data: null,
    };
  }
};
