'server only';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { artists, eventReviews, venues } from '@/lib/database/schema';
import { RatingDashboardFilters, RatingDashboardRow } from '@/lib/types';
import { asc, count, desc, eq, sql } from 'drizzle-orm';

const normalizeNumber = (value: unknown) => {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export async function getRatingDashboard(
  filters: RatingDashboardFilters,
): Promise<{
  data: RatingDashboardRow[];
  totalPages: number;
  currentPage: number;
}> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;
  const offset = (filters.currentPage - 1) * limit;

  try {
    if (filters.type === 'artist') {
      const averageRating = sql<number>`coalesce(
        avg(${eventReviews.artistRating}) filter (
          where ${eventReviews.isValid} = true and ${eventReviews.artistRating} is not null
        ),
        0
      )`;
      const totalReviews = sql<number>`coalesce(
        count(${eventReviews.artistRating}) filter (
          where ${eventReviews.isValid} = true and ${eventReviews.artistRating} is not null
        ),
        0
      )`;

      const orderByRating = filters.sort === 'asc' ? asc(averageRating) : desc(averageRating);

      const [rows, [{ totalCount }]] = await Promise.all([
        database
          .select({
            id: artists.id,
            slug: artists.slug,
            name: artists.name,
            surname: artists.surname,
            stageName: artists.stageName,
            averageRating,
            totalReviews,
          })
          .from(artists)
          .leftJoin(eventReviews, eq(eventReviews.artistId, artists.id))
          .groupBy(artists.id, artists.slug, artists.name, artists.surname, artists.stageName)
          .orderBy(orderByRating, asc(artists.name), asc(artists.surname))
          .limit(limit)
          .offset(offset),
        database.select({ totalCount: count() }).from(artists),
      ]);

      const data = rows.map((row) => {
        const stageName = row.stageName?.trim();
        const name = stageName ? stageName : `${row.name} ${row.surname}`.trim();

        return {
          id: row.id,
          slug: row.slug,
          name,
          averageRating: normalizeNumber(row.averageRating),
          totalReviews: normalizeNumber(row.totalReviews),
        };
      });

      return {
        data,
        totalPages: Math.ceil(Number(totalCount) / limit),
        currentPage: filters.currentPage,
      };
    }

    const averageRating = sql<number>`coalesce(
      avg(${eventReviews.venueRating}) filter (
        where ${eventReviews.isValid} = true and ${eventReviews.venueRating} is not null
      ),
      0
    )`;
    const totalReviews = sql<number>`coalesce(
      count(${eventReviews.venueRating}) filter (
        where ${eventReviews.isValid} = true and ${eventReviews.venueRating} is not null
      ),
      0
    )`;

    const orderByRating = filters.sort === 'asc' ? asc(averageRating) : desc(averageRating);

    const [rows, [{ totalCount }]] = await Promise.all([
      database
        .select({
          id: venues.id,
          slug: venues.slug,
          name: venues.name,
          averageRating,
          totalReviews,
        })
        .from(venues)
        .leftJoin(eventReviews, eq(eventReviews.venueId, venues.id))
        .groupBy(venues.id, venues.slug, venues.name)
        .orderBy(orderByRating, asc(venues.name))
        .limit(limit)
        .offset(offset),
      database.select({ totalCount: count() }).from(venues),
    ]);

    const data = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      averageRating: normalizeNumber(row.averageRating),
      totalReviews: normalizeNumber(row.totalReviews),
    }));

    return {
      data,
      totalPages: Math.ceil(Number(totalCount) / limit),
      currentPage: filters.currentPage,
    };
  } catch (error) {
    console.error('[getRatingDashboard] - Error:', error);
    throw new Error('Recupero classifiche non riuscito.');
  }
}
