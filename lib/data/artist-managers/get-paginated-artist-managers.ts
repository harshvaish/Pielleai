'use server';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { profiles, users } from '@/lib/database/schema';
import { ArtistManagerTableData } from '@/lib/types';
import { and, count, eq, ilike } from 'drizzle-orm';

export async function getPaginatedArtistManagers({
  currentPage,
  fullName,
  email,
  phone,
  // artist,
  company,
  limit = PAGINATED_TABLE_ROWS_X_PAGE,
}: {
  currentPage: number;
  fullName: string;
  email: string;
  phone: string;
  // artist: string;
  company: string;
  limit?: number;
}): Promise<{
  data: ArtistManagerTableData[];
  totalPages: number;
  currentPage: number;
}> {
  const offset = (currentPage - 1) * limit;

  try {
    // Get paginated data
    const usersResult = await database
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
          email ? ilike(users.email, `%${email}%`) : undefined,
          phone ? ilike(profiles.phone, `%${phone}%`) : undefined,
          company ? ilike(profiles.company, `%${company}%`) : undefined
        )
      )
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ userCount }] = await database
      .select({ userCount: count() })
      .from(users)
      .where(eq(users.role, 'artist-manager'));

    const totalPages = Math.ceil(Number(userCount) / limit);

    return {
      data: usersResult,
      totalPages,
      currentPage: currentPage,
    };
  } catch (error) {
    console.error('[getPaginatedArtistManagers] - Error:', error);
    throw new Error('Recupero managers artisti non riuscito.');
  }
}
