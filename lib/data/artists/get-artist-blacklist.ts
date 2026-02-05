'server only';

import { database } from '@/lib/database/connection';
import {
  artistBlacklistedAreas,
  artistBlacklistedVenues,
  countries,
  subdivisions,
  venues,
} from '@/lib/database/schema';
import { ArtistBlacklist } from '@/lib/types';
import { desc, eq } from 'drizzle-orm';

export async function getArtistBlacklist(artistId: number): Promise<ArtistBlacklist> {
  try {
    const [venueRows, areaRows] = await Promise.all([
      database
        .select({
          id: artistBlacklistedVenues.id,
          venueId: venues.id,
          venueSlug: venues.slug,
          venueStatus: venues.status,
          venueAvatarUrl: venues.avatarUrl,
          venueName: venues.name,
          venueAddress: venues.address,
          venueCity: venues.city,
        })
        .from(artistBlacklistedVenues)
        .innerJoin(venues, eq(artistBlacklistedVenues.venueId, venues.id))
        .where(eq(artistBlacklistedVenues.artistId, artistId))
        .orderBy(desc(artistBlacklistedVenues.createdAt)),
      database
        .select({
          id: artistBlacklistedAreas.id,
          countryId: countries.id,
          countryCode: countries.code,
          countryName: countries.name,
          countryIsEu: countries.isEu,
          subdivisionId: subdivisions.id,
          subdivisionName: subdivisions.name,
          city: artistBlacklistedAreas.city,
        })
        .from(artistBlacklistedAreas)
        .innerJoin(countries, eq(artistBlacklistedAreas.countryId, countries.id))
        .leftJoin(subdivisions, eq(artistBlacklistedAreas.subdivisionId, subdivisions.id))
        .where(eq(artistBlacklistedAreas.artistId, artistId))
        .orderBy(desc(artistBlacklistedAreas.createdAt)),
    ]);

    return {
      venues: venueRows.map((row) => ({
        id: row.id,
        venue: {
          id: row.venueId,
          slug: row.venueSlug,
          status: row.venueStatus,
          avatarUrl: row.venueAvatarUrl,
          name: row.venueName,
          address: row.venueAddress,
          city: row.venueCity,
        },
      })),
      areas: areaRows.map((row) => ({
        id: row.id,
        country: {
          id: row.countryId,
          code: row.countryCode,
          name: row.countryName,
          isEu: row.countryIsEu,
        },
        subdivision: row.subdivisionId
          ? {
              id: row.subdivisionId,
              name: row.subdivisionName || '-',
            }
          : null,
        city: row.city || null,
      })),
    };
  } catch (error) {
    console.error('[getArtistBlacklist] - Error: ', error);
    throw new Error('Recupero blacklist non riuscito.');
  }
}
