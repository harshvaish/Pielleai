'server only';

import { database } from '@/lib/database/connection';
import { artistBlacklistedAreas, artistBlacklistedVenues, venues } from '@/lib/database/schema';
import { ArtistBlacklistCheck } from '@/lib/types';
import { and, count, eq } from 'drizzle-orm';

const normalizeCity = (value: string | null | undefined) => (value ? value.trim().toLowerCase() : '');

export async function checkArtistBlacklist(
  artistId: number,
  venueId: number,
): Promise<ArtistBlacklistCheck> {
  try {
    const [directMatch] = await database
      .select({ count: count() })
      .from(artistBlacklistedVenues)
      .where(and(eq(artistBlacklistedVenues.artistId, artistId), eq(artistBlacklistedVenues.venueId, venueId)))
      .limit(1);

    if (directMatch?.count && directMatch.count > 0) {
      return { blocked: true, reason: 'venue' };
    }

    const [venue] = await database
      .select({
        countryId: venues.countryId,
        subdivisionId: venues.subdivisionId,
        city: venues.city,
      })
      .from(venues)
      .where(eq(venues.id, venueId))
      .limit(1);

    if (!venue) {
      return { blocked: false, reason: null };
    }

    const areaRows = await database
      .select({
        subdivisionId: artistBlacklistedAreas.subdivisionId,
        city: artistBlacklistedAreas.city,
      })
      .from(artistBlacklistedAreas)
      .where(
        and(
          eq(artistBlacklistedAreas.artistId, artistId),
          eq(artistBlacklistedAreas.countryId, venue.countryId),
        ),
      );

    const venueCity = normalizeCity(venue.city);
    const isBlocked = areaRows.some((row) => {
      const rowCity = normalizeCity(row.city);
      const hasSubdivision = row.subdivisionId !== null && row.subdivisionId !== undefined;
      const hasCity = row.city !== null && row.city !== undefined && rowCity.length > 0;

      if (!hasSubdivision) {
        if (!hasCity) return true;
        return venueCity.length > 0 && venueCity === rowCity;
      }

      if (venue.subdivisionId !== row.subdivisionId) return false;
      if (!hasCity) return true;

      return venueCity.length > 0 && venueCity === rowCity;
    });

    return { blocked: isBlocked, reason: isBlocked ? 'area' : null };
  } catch (error) {
    console.error('[checkArtistBlacklist] - Error: ', error);
    throw new Error('Controllo blacklist non riuscito.');
  }
}
