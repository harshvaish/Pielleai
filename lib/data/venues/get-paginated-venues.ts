'use server';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { profiles, users, venues } from '@/lib/database/schema';
import { VenueTableData } from '@/lib/types';
import { and, count, eq, ilike } from 'drizzle-orm';

export async function getPaginatedVenues({
  currentPage,
  name,
  limit = PAGINATED_TABLE_ROWS_X_PAGE,
}: {
  currentPage: number;
  name: string;
  limit?: number;
}): Promise<{
  data: VenueTableData[];
  totalPages: number;
  currentPage: number;
}> {
  const offset = (currentPage - 1) * limit;

  try {
    // Get paginated venues
    const venuesResult = await database
      .select({
        id: venues.id,
        slug: venues.slug,
        status: venues.status,
        avatarUrl: venues.avatarUrl,
        name: venues.name,
        company: venues.company,
        taxCode: venues.taxCode,
        address: venues.address,
        type: venues.type,
        capacity: venues.capacity,
        manager: {
          id: profiles.userId,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
          status: users.status,
        },
      })
      .from(venues)
      .innerJoin(profiles, eq(venues.managerProfileId, profiles.id))
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(and(name ? ilike(venues.name, `%${name}%`) : undefined))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ venueCount }] = await database
      .select({ venueCount: count() })
      .from(venues)
      .where(and(name ? ilike(venues.name, `%${name}%`) : undefined));

    const totalPages = Math.ceil(Number(venueCount) / limit);

    return {
      data: venuesResult,
      totalPages,
      currentPage,
    };
  } catch (error) {
    console.error('[getPaginatedVenues] - Error:', error);
    throw new Error('Recupero locali non riuscito.');
  }
}
