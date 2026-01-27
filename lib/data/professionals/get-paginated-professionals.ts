'server only';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { eventProfessionals, professionals } from '@/lib/database/schema';
import { ProfessionalListItem, ProfessionalsTableFilters } from '@/lib/types';
import { and, asc, count, desc, eq, ilike, inArray, sql } from 'drizzle-orm';

export async function getPaginatedProfessionals(
  filters: ProfessionalsTableFilters,
): Promise<{ data: ProfessionalListItem[]; totalPages: number; currentPage: number }> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;
  const offset = (filters.currentPage - 1) * limit;

  try {
    let professionalsFilteredIds: number[] | undefined = undefined;

    if (filters.eventId) {
      const eventResults = await database
        .select({ professionalId: eventProfessionals.professionalId })
        .from(eventProfessionals)
        .where(eq(eventProfessionals.eventId, Number(filters.eventId)));

      professionalsFilteredIds = [...new Set(eventResults.map((r) => r.professionalId))];

      if (professionalsFilteredIds.length === 0) {
        return { data: [], totalPages: 0, currentPage: filters.currentPage };
      }
    }

    const baseFilters = and(
      filters.fullName ? ilike(professionals.fullName, `%${filters.fullName}%`) : undefined,
      filters.role ? eq(professionals.role, filters.role) : undefined,
      professionalsFilteredIds ? inArray(professionals.id, professionalsFilteredIds) : undefined,
    );

    const [rows, [{ totalCount }]] = await Promise.all([
      database
        .select({
          id: professionals.id,
          fullName: professionals.fullName,
          role: professionals.role,
          roleDescription: professionals.roleDescription,
          email: professionals.email,
          phone: professionals.phone,
          competencies: professionals.competencies,
          createdAt: professionals.createdAt,
          updatedAt: professionals.updatedAt,
          eventCount: sql<number>`coalesce((select count(*) from event_professionals where professional_id = ${professionals.id}), 0)`,
        })
        .from(professionals)
        .where(baseFilters)
        .orderBy(desc(professionals.createdAt), asc(professionals.fullName))
        .limit(limit)
        .offset(offset),
      database.select({ totalCount: count() }).from(professionals).where(baseFilters),
    ]);

    const totalPages = Math.ceil(Number(totalCount) / limit);

    return { data: rows as ProfessionalListItem[], totalPages, currentPage: filters.currentPage };
  } catch (error) {
    console.error('[getPaginatedProfessionals] - Error:', error);
    throw new Error('Recupero professionisti non riuscito.');
  }
}
