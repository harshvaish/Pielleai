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
import { artistS1FormSchema, ArtistS1FormSchema } from '@/lib/validation/artist-form-schema';
import { areSame, hasRole } from '@/lib/utils';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';

export const updateArtistPersonalData = async (
  artistId: number,
  data: ArtistS1FormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateArtistPersonalData] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager'])) {
      console.error('[updateArtistPersonalData] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = artistS1FormSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[updateArtistPersonalData] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { languages, countryId, subdivisionId, zones, artistManagers } = validation.data;
    const safeLanguages = languages ?? [];
    const safeZones = zones ?? [];
    const safeArtistManagers = artistManagers ?? [];

    const [languagesCheck, countryCheck, subdivisionCheck, zonesCheck] = await Promise.all([
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

      safeZones.length
        ? database
            .select({ id: zonesTable.id })
            .from(zonesTable)
            .where(inArray(zonesTable.id, safeZones))
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
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
    }

    if (zonesCheck.length !== safeZones.length) {
      throw new AppError('Una o più aree di interesse selezionate non valide.');
    }

    if (safeArtistManagers.length > 0) {
      const artistManagersCheck = await database
        .select({ id: profiles.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(and(eq(users.role, 'artist-manager'), inArray(profiles.id, safeArtistManagers)));

      if (artistManagersCheck.length !== safeArtistManagers.length) {
        throw new AppError('Una o più manager selezionati non validi.');
      }
    }

    const [existingLanguages, existingZones, existingManagers] = await Promise.all([
      database
        .select({ languageId: artistLanguages.languageId })
        .from(artistLanguages)
        .where(eq(artistLanguages.artistId, artistId)),
      database
        .select({ zoneId: artistZones.zoneId })
        .from(artistZones)
        .where(eq(artistZones.artistId, artistId)),
      database
        .select({ managerProfileId: managerArtists.managerProfileId })
        .from(managerArtists)
        .where(eq(managerArtists.artistId, artistId)),
    ]);

    const existingLanguageIds = existingLanguages.map((l) => l.languageId);
    const existingZoneIds = existingZones.map((z) => z.zoneId);
    const existingManagerIds = existingManagers.map((m) => m.managerProfileId);

    await database.transaction(async (tx) => {
      const updateResult = await tx
        .update(artists)
        .set({
          avatarUrl: validation.data.avatarUrl || '',
          name: validation.data.name || 'Artista',
          surname: validation.data.surname || '',
          stageName: validation.data.stageName || validation.data.name || 'Artista',
          bio: validation.data.bio || '',
          categories: validation.data.categories ?? [],
          capacityCategory: validation.data.capacityCategory ?? null,
          email:
            validation.data.email?.trim() || '',
          phone: validation.data.phone || '',
          birthDate: validation.data.birthDate ?? undefined,
          birthPlace: validation.data.birthPlace || '',
          ...(validation.data.gender && { gender: validation.data.gender }),
          address: validation.data.address || null,
          addressFormatted: validation.data.addressFormatted ?? null,
          streetName: validation.data.streetName ?? null,
          streetNumber: validation.data.streetNumber ?? null,
          placeId: validation.data.placeId ?? null,
          latitude: validation.data.latitude ? validation.data.latitude : null,
          longitude: validation.data.longitude ? validation.data.longitude : null,
          countryName: validation.data.countryName ?? null,
          countryCode: validation.data.countryCode ?? null,
          ...(validation.data.countryId !== undefined && validation.data.countryId !== null && { countryId: validation.data.countryId }),
          ...(validation.data.subdivisionId !== undefined && validation.data.subdivisionId !== null && { subdivisionId: validation.data.subdivisionId }),
          city: validation.data.city || null,
          zipCode: validation.data.zipCode || null,
          tourManagerName: validation.data.tourManagerName || '',
          tourManagerSurname: validation.data.tourManagerSurname || '',
          tourManagerEmail: validation.data.tourManagerEmail || '',
          tourManagerPhone: validation.data.tourManagerPhone || '',
          updatedAt: new Date(),
        })
        .where(eq(artists.id, artistId))
        .returning({ slug: artists.slug });

      const slug = updateResult[0]?.slug;
      if (slug) revalidateTag(`artist:${slug}`, 'max');
      revalidateTag('artists', 'max');

      if (!areSame(existingLanguageIds, safeLanguages)) {
        await tx.delete(artistLanguages).where(eq(artistLanguages.artistId, artistId));
        if (safeLanguages.length > 0) {
          await tx.insert(artistLanguages).values(
            safeLanguages.map((languageId) => ({
              artistId,
              languageId,
            })),
          );
        }
      }

      if (!areSame(existingZoneIds, safeZones)) {
        await tx.delete(artistZones).where(eq(artistZones.artistId, artistId));
        if (safeZones.length > 0) {
          await tx
            .insert(artistZones)
            .values(safeZones.map((zoneId) => ({ artistId, zoneId })));
        }
      }

      if (!areSame(existingManagerIds, safeArtistManagers)) {
        await tx.delete(managerArtists).where(eq(managerArtists.artistId, artistId));
        if (safeArtistManagers.length > 0) {
          await tx.insert(managerArtists).values(
            safeArtistManagers.map((managerProfileId) => ({
              artistId,
              managerProfileId,
            })),
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
    console.error('[updateArtistPersonalData] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento artista non riuscito.',
      data: null,
    };
  }
};
