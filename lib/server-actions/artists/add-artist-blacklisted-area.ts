'use server';

import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { artistBlacklistedAreas, countries, subdivisions } from '@/lib/database/schema';
import { ArtistBlacklistArea, ServerActionResponse } from '@/lib/types';
import { cityValidation, idValidation } from '@/lib/validation/_general';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import { ensureArtistBlacklistAccess } from './ensure-artist-blacklist-access';

const normalizeCity = (value: string | null | undefined) => (value ? value.trim().toLowerCase() : '');

export const addArtistBlacklistedArea = async (params: {
  artistId: number;
  countryId: number;
  subdivisionId?: number | null;
  city?: string | null;
}): Promise<ServerActionResponse<ArtistBlacklistArea>> => {
  try {
    const user = await ensureArtistBlacklistAccess(params.artistId);

    const schema = z.object({
      artistId: idValidation,
      countryId: idValidation,
      subdivisionId: idValidation.optional().nullable(),
      city: cityValidation.optional().nullable(),
    });

    const payload = {
      artistId: params.artistId,
      countryId: params.countryId,
      subdivisionId: params.subdivisionId ?? null,
      city: params.city && params.city.trim().length > 0 ? params.city.trim() : null,
    };

    const validation = schema.safeParse(payload);

    if (!validation.success) {
      console.error(
        '[addArtistBlacklistedArea] - Error: validation failed - ',
        validation.error.issues[0],
      );
      throw new AppError('Dati inviati non corretti.');
    }

    const [country] = await database
      .select({ id: countries.id, code: countries.code, name: countries.name, isEu: countries.isEu })
      .from(countries)
      .where(eq(countries.id, validation.data.countryId))
      .limit(1);

    if (!country) {
      throw new AppError('Stato non valido.');
    }

    let subdivision: { id: number; name: string; countryId: number } | null = null;

    if (validation.data.subdivisionId) {
      const [subdivisionRow] = await database
        .select({ id: subdivisions.id, name: subdivisions.name, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, validation.data.subdivisionId))
        .limit(1);

      if (!subdivisionRow || subdivisionRow.countryId !== validation.data.countryId) {
        throw new AppError('Provincia non valida.');
      }

      subdivision = subdivisionRow;
    }

    const existing = await database
      .select({
        id: artistBlacklistedAreas.id,
        subdivisionId: artistBlacklistedAreas.subdivisionId,
        city: artistBlacklistedAreas.city,
      })
      .from(artistBlacklistedAreas)
      .where(
        and(
          eq(artistBlacklistedAreas.artistId, validation.data.artistId),
          eq(artistBlacklistedAreas.countryId, validation.data.countryId),
        ),
      );

    const normalizedCity = normalizeCity(validation.data.city);
    const duplicate = existing.some((row) => {
      const rowCity = normalizeCity(row.city);
      const sameSubdivision = (row.subdivisionId ?? null) === (validation.data.subdivisionId ?? null);
      return sameSubdivision && rowCity === normalizedCity;
    });

    if (duplicate) {
      throw new AppError('Area gia presente in blacklist.');
    }

    const [inserted] = await database
      .insert(artistBlacklistedAreas)
      .values({
        artistId: validation.data.artistId,
        countryId: validation.data.countryId,
        subdivisionId: validation.data.subdivisionId ?? null,
        city: validation.data.city ?? null,
        createdByUserId: user.id,
      })
      .returning({ id: artistBlacklistedAreas.id });

    if (!inserted) {
      throw new AppError('Inserimento non riuscito.');
    }

    return {
      success: true,
      message: null,
      data: {
        id: inserted.id,
        country,
        subdivision: subdivision ? { id: subdivision.id, name: subdivision.name } : null,
        city: validation.data.city ?? null,
      },
    };
  } catch (error) {
    console.error('[addArtistBlacklistedArea] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Inserimento blacklist non riuscito.',
      data: null,
    };
  }
};
