'use server';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import {
  artists,
  managerArtists,
  profiles,
  users,
} from '@/lib/database/schema';
import { ArtistManagerTableData, ArtistSelectData } from '@/lib/types';
import { and, count, eq, ilike, inArray } from 'drizzle-orm';

export async function getPaginatedArtistManagers({
  currentPage,
  fullName,
  email,
  phone,
  artist,
  company,
  limit = PAGINATED_TABLE_ROWS_X_PAGE,
}: {
  currentPage: number;
  fullName: string;
  email: string;
  phone: string;
  artist: string;
  company: string;
  limit?: number;
}): Promise<{
  data: ArtistManagerTableData[];
  totalPages: number;
  currentPage: number;
}> {
  console.log(artist);
  const offset = (currentPage - 1) * limit;

  try {
    // Get paginated data
    const managersResult = await database
      .select({
        id: users.id,
        profileId: profiles.id,
        status: users.status,
        createdAt: users.createdAt,
        avatarUrl: profiles.avatarUrl,
        name: profiles.name,
        surname: profiles.surname,
        phone: profiles.phone,
        email: users.email,
        company: profiles.company,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(
        and(
          eq(users.role, 'artist-manager'),
          fullName ? ilike(profiles.name, `%${fullName}%`) : undefined,
          fullName ? ilike(profiles.surname, `%${fullName}%`) : undefined,
          email ? ilike(users.email, `%${email}%`) : undefined,
          phone ? ilike(profiles.phone, `%${phone}%`) : undefined,
          company ? ilike(profiles.company, `%${company}%`) : undefined
        )
      )
      .limit(limit)
      .offset(offset);

    const managerProfilesIds = managersResult.map((m) => m.profileId);

    const [artistsResult, [{ userCount }]] = await Promise.all([
      database
        .select({
          managerId: managerArtists.managerProfileId,
          id: artists.id,
          status: artists.status,
          slug: artists.slug,
          avatarUrl: artists.avatarUrl,
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
        })
        .from(managerArtists)
        .innerJoin(artists, eq(managerArtists.artistId, artists.id))
        .where(inArray(managerArtists.managerProfileId, managerProfilesIds)),

      database
        .select({ userCount: count() })
        .from(users)
        .innerJoin(profiles, eq(users.id, profiles.userId))
        .where(
          and(
            eq(users.role, 'artist-manager'),
            fullName ? ilike(profiles.name, `%${fullName}%`) : undefined,
            fullName ? ilike(profiles.surname, `%${fullName}%`) : undefined,
            email ? ilike(users.email, `%${email}%`) : undefined,
            phone ? ilike(profiles.phone, `%${phone}%`) : undefined,
            company ? ilike(profiles.company, `%${company}%`) : undefined
          )
        ),
    ]);

    // Group artists by managerProfileId
    const artistsByManager: Record<number, ArtistSelectData[]> = {};

    for (const row of artistsResult) {
      if (!artistsByManager[row.managerId]) {
        artistsByManager[row.managerId] = [];
      }
      artistsByManager[row.managerId].push({
        id: row.id,
        status: row.status,
        slug: row.slug,
        avatarUrl: row.avatarUrl,
        name: row.name,
        surname: row.surname,
        stageName: row.stageName,
      });
    }

    // Merge managers + artists
    const mergedResult = managersResult.map((manager) => ({
      ...manager,
      artists: artistsByManager[manager.profileId] || [],
      company: manager.company ?? '',
    }));

    const totalPages = Math.ceil(Number(userCount) / limit);

    return {
      data: mergedResult,
      totalPages,
      currentPage: currentPage,
    };
  } catch (error) {
    console.error('[getPaginatedArtistManagers] - Error:', error);
    throw new Error('Recupero managers artisti non riuscito.');
  }
}
