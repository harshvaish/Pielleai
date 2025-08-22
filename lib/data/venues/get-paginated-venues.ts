'server only';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { profiles, users, venues } from '@/lib/database/schema';
import { VenuesTableFilters, VenueTableData } from '@/lib/types';
import { and, count, desc, eq, gte, ilike, inArray } from 'drizzle-orm';

export async function getPaginatedVenues({ currentPage, name, company, taxCode, address, types, managerIds, capacity }: VenuesTableFilters): Promise<{
  data: VenueTableData[];
  totalPages: number;
  currentPage: number;
}> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;
  const offset = (currentPage - 1) * limit;

  try {
    // Get all matching managerProfileIds based on artist filter
    let managersFilteredVenueIds: number[] | undefined = undefined;

    if (managerIds.length > 0) {
      const venueResults = await database
        .select({ id: venues.id })
        .from(venues)
        .where(inArray(venues.managerProfileId, managerIds.map(Number)));

      managersFilteredVenueIds = [...new Set(venueResults.map((r) => r.id))];

      if (managersFilteredVenueIds.length === 0) {
        return {
          data: [],
          totalPages: 0,
          currentPage,
        };
      }
    }

    // Build reusable filters
    const filters = and(
      name ? ilike(venues.name, `%${name}%`) : undefined,
      company ? ilike(venues.company, `%${company}%`) : undefined,
      taxCode ? ilike(venues.taxCode, `%${taxCode}%`) : undefined,
      address ? ilike(venues.address, `%${address}%`) : undefined,
      types.length > 0 ? inArray(venues.type, types) : undefined,
      managersFilteredVenueIds ? inArray(venues.id, managersFilteredVenueIds) : undefined,
      capacity ? gte(venues.capacity, parseInt(capacity)) : undefined
    );

    // Get paginated venues and total count
    const [venuesResult, [{ venueCount }]] = await Promise.all([
      database
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
          createdAt: venues.createdAt,
        })
        .from(venues)
        .innerJoin(profiles, eq(venues.managerProfileId, profiles.id))
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(filters)
        .orderBy(desc(venues.createdAt))
        .limit(limit)
        .offset(offset),
      database.select({ venueCount: count() }).from(venues).where(filters),
    ]);

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
