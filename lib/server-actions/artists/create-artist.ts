'use server';

import { ArtistSelectData, ServerActionResponse } from '@/lib/types';
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
import type { ArtistFormSchema } from '@/lib/validation/artist-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import { hasRole } from '@/lib/utils';
import getSession from '@/lib/data/auth/get-session';

export const createArtist = async (
  data: ArtistFormSchema,
): Promise<ServerActionResponse<ArtistSelectData>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createArtist] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      console.error('[createArtist] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const isAdmin = user.role === 'admin';

    const {
      languages,
      countryId,
      subdivisionId,
      billingCountry,
      billingSubdivisionId,
      zones,
      artistManagers,
    } = data;
    const safeLanguages = Array.isArray(languages) ? languages : [];
    const safeZones = Array.isArray(zones) ? zones : [];
    const safeArtistManagers = Array.isArray(artistManagers) ? artistManagers : [];
    const fallbackEmail = data.email?.trim() || '';
    const fallbackName = data.name?.trim() || 'Artista';
    const fallbackSurname = data.surname?.trim() || '';
    const fallbackStageName = data.stageName?.trim() || fallbackName;
    const fallbackBirthDate = data.birthDate || '1970-01-01';
    const fallbackGender = data.gender || 'non-binary';

    const [
      languagesCheck,
      countryCheck,
      subdivisionCheck,
      billingCountryCheck,
      billingSubdivisionCheck,
      zonesCheck,
    ] = await Promise.all([
      safeLanguages.length
        ? database
            .select({ id: languagesTable.id })
            .from(languagesTable)
            .where(inArray(languagesTable.id, safeLanguages))
        : Promise.resolve([]),

      countryId
        ? database.select({ id: countries.id }).from(countries).where(eq(countries.id, countryId))
        : null,

      subdivisionId
        ? database
            .select({ id: subdivisions.id, countryId: subdivisions.countryId })
            .from(subdivisions)
            .where(eq(subdivisions.id, subdivisionId))
        : null,

      billingCountry
        ? database
            .select({ id: countries.id })
            .from(countries)
            .where(eq(countries.id, billingCountry.id))
        : null,

      billingSubdivisionId
        ? database
            .select({ id: subdivisions.id, countryId: subdivisions.countryId })
            .from(subdivisions)
            .where(eq(subdivisions.id, billingSubdivisionId))
        : null,

      safeZones.length
        ? database.select({ id: zonesTable.id }).from(zonesTable).where(inArray(zonesTable.id, safeZones))
        : Promise.resolve([]),
    ]);

    if (languagesCheck.length !== safeLanguages.length) {
      throw new AppError('Una o più lingue selezionate non valide.');
    }

    if (countryCheck && countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (subdivisionCheck && subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (subdivisionCheck && countryId && subdivisionCheck[0].countryId != countryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato');
    }

    if (billingCountryCheck && billingCountryCheck.length !== 1) {
      throw new AppError('Nazione selezionata non valida.');
    }

    if (billingSubdivisionCheck && billingSubdivisionCheck.length !== 1) {
      throw new AppError('Provincia di fatturazione selezionata non valida.');
    }

    if (
      billingSubdivisionCheck &&
      billingCountry &&
      billingSubdivisionCheck[0].countryId != billingCountry.id
    ) {
      throw new AppError('La provincia di fatturazione non appartiene alla nazione selezionata.');
    }

    if (zonesCheck.length !== safeZones.length) {
      throw new AppError('Una o più aree di interesse selezionate non valide.');
    }

    if (safeArtistManagers.length > 0) {
      const artistManagersCheck = await database
        .select({ id: users.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(and(eq(users.role, 'artist-manager'), inArray(profiles.id, safeArtistManagers)));

      if (artistManagersCheck.length !== safeArtistManagers.length) {
        throw new AppError('Una o più manager selezionati non validi.');
      }

      if (!isAdmin && artistManagersCheck[0].id !== user.id) {
        throw new AppError('Non è possibile selezionare un manager diverso da te.');
      }
    }

    let createdArtist: ArtistSelectData | null = null;

    await database.transaction(async (tx) => {
      const insertValues: any = {
        status: 'active',

        avatarUrl: data.avatarUrl || '',
        name: data.name || fallbackName,
        surname: data.surname || fallbackSurname,
        stageName: data.stageName || fallbackStageName,
        bio: data.bio || '',
        categories: data.categories ?? [],
        capacityCategory: data.capacityCategory ?? null,
        email: fallbackEmail,
        phone: data.phone || '',
        birthPlace: data.birthPlace || '',
        address: data.address || null,
        countryId: data.countryId || null,
        subdivisionId: data.subdivisionId || null,
        city: data.city || null,
        zipCode: data.zipCode || null,
        tourManagerName: data.tourManagerName || '',
        tourManagerSurname: data.tourManagerSurname || '',
        tourManagerEmail: data.tourManagerEmail || '',
        tourManagerPhone: data.tourManagerPhone || '',

        company: data.company || null,
        taxCode: data.taxCode || null,
        ipiCode: data.ipiCode || null,
        bicCode: data.bicCode || null,
        abaRoutingNumber: data.abaRoutingNumber || null,
        iban: data.iban || null,
        sdiRecipientCode: data.sdiRecipientCode || null,
        billingAddress: data.billingAddress || null,
        billingCountryId: data.billingCountry?.id || null,
        billingSubdivisionId: data.billingSubdivisionId || null,
        billingCity: data.billingCity || null,
        billingZipCode: data.billingZipCode || null,
        billingEmail: data.billingEmail || null,
        billingPhone: data.billingPhone || null,
        billingPec: data.billingPec || null,
        taxableInvoice: data.taxableInvoice === 'true',
        birthDate: fallbackBirthDate,
        gender: fallbackGender,

        tiktokUrl: data.tiktokUrl || null,
        tiktokUsername: data.tiktokUsername || null,
        tiktokFollowers: data.tiktokFollowers || null,
        tiktokCreatedAt: data.tiktokCreatedAt || null,

        facebookUrl: data.facebookUrl || null,
        facebookUsername: data.facebookUsername || null,
        facebookFollowers: data.facebookFollowers || null,
        facebookCreatedAt: data.facebookCreatedAt || null,

        instagramUrl: data.instagramUrl || null,
        instagramUsername: data.instagramUsername || null,
        instagramFollowers: data.instagramFollowers || null,
        instagramCreatedAt: data.instagramCreatedAt || null,

        xUrl: data.xUrl || null,
        xUsername: data.xUsername || null,
        xFollowers: data.xFollowers || null,
        xCreatedAt: data.xCreatedAt || null,
      };

      const artistResult = await tx
        .insert(artists)
        .values(insertValues)
        .returning({ id: artists.id, slug: artists.slug });

      const newArtistId = artistResult[0]?.id;
      if (!newArtistId) {
        throw new AppError('Recupero id artista non riuscito.');
      }

      const slug = artistResult[0]?.slug;
      if (slug) revalidateTag(`artist:${slug}`, 'max');
      revalidateTag('artists', 'max');

      createdArtist = {
        id: newArtistId,
        slug: slug ?? '',
        status: 'active',
        avatarUrl: insertValues.avatarUrl ?? '',
        name: insertValues.name ?? '',
        surname: insertValues.surname ?? '',
        stageName: insertValues.stageName ?? '',
        tourManagerEmail: insertValues.tourManagerEmail ?? undefined,
        tourManagerName: insertValues.tourManagerName ?? undefined,
        tourManagerSurname: insertValues.tourManagerSurname ?? undefined,
        tourManagerPhone: insertValues.tourManagerPhone ?? undefined,
      };

      const languageInserts = safeLanguages.map((languageId: number) => ({
        artistId: newArtistId,
        languageId,
      }));

      if (languageInserts.length > 0) {
        await tx.insert(artistLanguages).values(languageInserts);
      }

      const managerArtistsInserts = safeArtistManagers.map((artistManagerId: number) => ({
        managerProfileId: artistManagerId,
        artistId: newArtistId,
      }));

      if (managerArtistsInserts.length > 0) {
        await tx.insert(managerArtists).values(managerArtistsInserts);
      }

      const artistZonesInserts = safeZones.map((zoneId: number) => ({
        artistId: newArtistId,
        zoneId: zoneId,
      }));

      if (artistZonesInserts.length > 0) {
        await tx.insert(artistZones).values(artistZonesInserts);
      }
    });

    if (!createdArtist) {
      throw new AppError('Recupero artista non riuscito.');
    }

    return {
      success: true,
      message: null,
      data: createdArtist,
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
