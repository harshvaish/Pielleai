'use server';

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
import getSession from '@/lib/data/auth/get-session';

export const createArtist = async (data: ArtistFormSchema): Promise<ServerActionResponse<null>> => {
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
    const safeLanguages = languages ?? [];
    const safeZones = zones ?? [];
    const safeArtistManagers = artistManagers ?? [];
    const fallbackEmail = validation.data.email?.trim() || `artist+${Date.now()}`;
    const fallbackName = validation.data.name?.trim() || 'Artista';
    const fallbackSurname = validation.data.surname?.trim() || '';
    const fallbackStageName = validation.data.stageName?.trim() || fallbackName;
    const fallbackBirthDate = validation.data.birthDate || '1970-01-01';
    const fallbackGender = validation.data.gender || 'male';

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

    await database.transaction(async (tx) => {
      const artistResult = await tx
        .insert(artists)
        .values({
          status: 'active',

          avatarUrl: validation.data.avatarUrl || '',
          name: validation.data.name || fallbackName,
          surname: validation.data.surname || fallbackSurname,
          stageName: validation.data.stageName || fallbackStageName,
          bio: validation.data.bio || '',
          email: fallbackEmail,
          phone: validation.data.phone || '',
          birthDate: fallbackBirthDate,
          birthPlace: validation.data.birthPlace || '',
          gender: fallbackGender,
          address: validation.data.address || null,
          countryId: validation.data.countryId || null,
          subdivisionId: validation.data.subdivisionId || null,
          city: validation.data.city || null,
          zipCode: validation.data.zipCode || null,
          tourManagerName: validation.data.tourManagerName || '',
          tourManagerSurname: validation.data.tourManagerSurname || '',
          tourManagerEmail: validation.data.tourManagerEmail || '',
          tourManagerPhone: validation.data.tourManagerPhone || '',

          company: validation.data.company || null,
          taxCode: validation.data.taxCode || null,
          ipiCode: validation.data.ipiCode || null,
          bicCode: validation.data.bicCode || null,
          abaRoutingNumber: validation.data.abaRoutingNumber || null,
          iban: validation.data.iban || null,
          sdiRecipientCode: validation.data.sdiRecipientCode || null,
          billingAddress: validation.data.billingAddress || null,
          billingCountryId: validation.data.billingCountry?.id || null,
          billingSubdivisionId: validation.data.billingSubdivisionId || null,
          billingCity: validation.data.billingCity || null,
          billingZipCode: validation.data.billingZipCode || null,
          billingEmail: validation.data.billingEmail || null,
          billingPhone: validation.data.billingPhone || null,
          billingPec: validation.data.billingPec || null,
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
      if (slug) revalidateTag(`artist:${slug}`, 'max');
      revalidateTag('artists', 'max');

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
