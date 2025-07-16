'use server';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { profiles, users, venues } from '@/lib/database/schema';
import { VenueManagerTableData, VenueBadgeData } from '@/lib/types';
import { and, count, eq, ilike, inArray } from 'drizzle-orm';

export async function getPaginatedVenueManagers({
  currentPage,
  fullName,
  email,
  phone,
  // venue,
  company,
  limit = PAGINATED_TABLE_ROWS_X_PAGE,
}: {
  currentPage: number;
  fullName: string;
  email: string;
  phone: string;
  // venue: string;
  company: string;
  limit?: number;
}): Promise<{
  data: VenueManagerTableData[];
  totalPages: number;
  currentPage: number;
}> {
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
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(
        and(
          eq(users.role, 'venue-manager'),
          fullName ? ilike(profiles.name, `%${fullName}%`) : undefined,
          email ? ilike(users.email, `%${email}%`) : undefined,
          phone ? ilike(profiles.phone, `%${phone}%`) : undefined,
          company ? ilike(profiles.company, `%${company}%`) : undefined
        )
      )
      .limit(limit)
      .offset(offset);

    const managerProfilesIds = managersResult.map((m) => m.profileId);

    const [venuesResult, [{ userCount }]] = await Promise.all([
      database
        .select({
          managerId: venues.managerProfileId,
          id: venues.id,
          status: venues.status,
          slug: venues.slug,
          avatarUrl: venues.avatarUrl,
          name: venues.name,
        })
        .from(venues)
        .where(inArray(venues.managerProfileId, managerProfilesIds)),

      database
        .select({ userCount: count() })
        .from(users)
        .where(
          and(
            eq(users.role, 'venue-manager'),
            fullName ? ilike(profiles.name, `%${fullName}%`) : undefined,
            email ? ilike(users.email, `%${email}%`) : undefined,
            phone ? ilike(profiles.phone, `%${phone}%`) : undefined,
            company ? ilike(profiles.company, `%${company}%`) : undefined
          )
        ),
    ]);

    // Group venues by managerProfileId
    const venuesByManager: Record<number, VenueBadgeData[]> = {};

    for (const row of venuesResult) {
      if (!venuesByManager[row.managerId]) {
        venuesByManager[row.managerId] = [];
      }
      venuesByManager[row.managerId].push({
        id: row.id,
        status: row.status,
        slug: row.slug,
        avatarUrl: row.avatarUrl,
        name: row.name,
      });
    }

    // Merge managers + artists
    const mergedResult = managersResult.map((manager) => ({
      ...manager,
      venues: venuesByManager[manager.profileId] || [],
    }));

    const totalPages = Math.ceil(Number(userCount) / limit);

    return {
      data: mergedResult,
      totalPages,
      currentPage: currentPage,
    };
  } catch (error) {
    console.error('[getPaginatedVenueManagers] - Error:', error);
    throw new Error('Recupero promoter locali non riuscito.');
  }
}
