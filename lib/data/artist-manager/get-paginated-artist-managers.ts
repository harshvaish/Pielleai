'use server';

import { database } from '@/lib/database/connection';
import { profiles, users } from '@/lib/database/schema';
import { ArtistManagerTableData } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function getPaginatedArtistManagers(): Promise<
  ArtistManagerTableData[]
> {
  try {
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
      .where(eq(users.role, 'artist-manager'));

    return usersResult;
  } catch (error) {
    console.error('[getPaginatedArtistManagers] - Error:', error);
    throw new Error('Recupero managers artisti non riuscito.');
  }
}
