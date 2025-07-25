'server only';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import {
  artists,
  artistZones,
  zones,
  managerArtists,
  profiles,
  users,
} from '@/lib/database/schema';
import { ArtistTableData, ArtistManagerSelectData, Zone } from '@/lib/types';
import { and, count, eq, ilike, inArray } from 'drizzle-orm';

export async function getPaginatedArtists({
  currentPage,
  fullName,
  email,
  phone,
  managerIds,
  zoneIds,
  limit = PAGINATED_TABLE_ROWS_X_PAGE,
}: {
  currentPage: number;
  fullName: string;
  email: string;
  phone: string;
  managerIds: string[];
  zoneIds: string[];
  limit?: number;
}): Promise<{
  data: ArtistTableData[];
  totalPages: number;
  currentPage: number;
}> {
  const offset = (currentPage - 1) * limit;

  try {
    //Get all matching artistIds based on manager filter
    let managerFilteredArtistIds: number[] | undefined = undefined;

    if (managerIds.length > 0) {
      const artistResults = await database
        .select({ artistId: managerArtists.artistId })
        .from(artists)
        .innerJoin(managerArtists, eq(artists.id, managerArtists.artistId))
        .where(
          inArray(managerArtists.managerProfileId, managerIds.map(Number))
        );

      managerFilteredArtistIds = [
        ...new Set(artistResults.map((r) => r.artistId)),
      ];

      if (managerFilteredArtistIds.length === 0) {
        return {
          data: [],
          totalPages: 0,
          currentPage,
        };
      }
    }

    //Get all matching zoneIds based on zone filter
    let zoneFilteredArtistIds: number[] | undefined = undefined;

    if (zoneIds.length > 0) {
      const artistResults = await database
        .select({ artistId: artistZones.artistId })
        .from(artists)
        .innerJoin(artistZones, eq(artists.id, artistZones.artistId))
        .innerJoin(zones, eq(artistZones.zoneId, zones.id))
        .where(inArray(artistZones.zoneId, zoneIds.map(Number)));

      zoneFilteredArtistIds = [
        ...new Set(artistResults.map((r) => r.artistId)),
      ];

      if (zoneFilteredArtistIds.length === 0) {
        return {
          data: [],
          totalPages: 0,
          currentPage,
        };
      }
    }

    // Get paginated artists
    const artistsResult = await database
      .select({
        id: artists.id,
        slug: artists.slug,
        avatarUrl: artists.avatarUrl,
        name: artists.name,
        surname: artists.surname,
        email: artists.email,
        phone: artists.phone,
        company: artists.company,
        status: artists.status,
        createdAt: artists.createdAt,
      })
      .from(artists)
      .where(
        and(
          fullName ? ilike(artists.name, `%${fullName}%`) : undefined,
          email ? ilike(artists.email, `%${email}%`) : undefined,
          phone ? ilike(artists.phone, `%${phone}%`) : undefined,
          managerFilteredArtistIds
            ? inArray(artists.id, managerFilteredArtistIds)
            : undefined,
          zoneFilteredArtistIds
            ? inArray(artists.id, zoneFilteredArtistIds)
            : undefined
        )
      )
      .limit(limit)
      .offset(offset);

    const artistIds = artistsResult.map((a) => a.id);

    const [zonesResult, managersResult, [{ userCount }]] = await Promise.all([
      database
        .select({
          artistId: artistZones.artistId,
          id: zones.id,
          name: zones.name,
        })
        .from(artistZones)
        .innerJoin(zones, eq(artistZones.zoneId, zones.id))
        .where(inArray(artistZones.artistId, artistIds)),

      database
        .select({
          artistId: managerArtists.artistId,
          id: profiles.userId,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
          status: users.status,
        })
        .from(managerArtists)
        .innerJoin(profiles, eq(managerArtists.managerProfileId, profiles.id))
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(inArray(managerArtists.artistId, artistIds)),

      database
        .select({ userCount: count() })
        .from(artists)
        .where(
          and(
            fullName ? ilike(artists.name, `%${fullName}%`) : undefined,
            email ? ilike(artists.email, `%${email}%`) : undefined,
            phone ? ilike(artists.phone, `%${phone}%`) : undefined,
            managerFilteredArtistIds
              ? inArray(artists.id, managerFilteredArtistIds)
              : undefined,
            zoneFilteredArtistIds
              ? inArray(artists.id, zoneFilteredArtistIds)
              : undefined
          )
        ),
    ]);

    // Group managers by artistId
    const managersByArtist: Record<number, ArtistManagerSelectData[]> = {};

    for (const row of managersResult) {
      if (!managersByArtist[row.artistId]) {
        managersByArtist[row.artistId] = [];
      }
      managersByArtist[row.artistId].push({
        id: row.id,
        profileId: row.profileId,
        avatarUrl: row.avatarUrl,
        name: row.name,
        surname: row.surname,
        status: row.status,
      });
    }

    // Group zones by artistId
    const zonesByArtist: Record<number, Zone[]> = {};

    for (const row of zonesResult) {
      if (!zonesByArtist[row.artistId]) {
        zonesByArtist[row.artistId] = [];
      }
      zonesByArtist[row.artistId].push({
        id: row.id,
        name: row.name,
      });
    }

    // Merge artist + managers + zones
    const mergedResult = artistsResult.map((artist) => ({
      ...artist,
      zones: zonesByArtist[artist.id] || [],
      managers: managersByArtist[artist.id] || [],
    }));

    const totalPages = Math.ceil(Number(userCount) / limit);

    return {
      data: mergedResult,
      totalPages,
      currentPage,
    };
  } catch (error) {
    console.error('[getPaginatedArtists] - Error:', error);
    throw new Error('Recupero artisti non riuscito.');
  }
}
