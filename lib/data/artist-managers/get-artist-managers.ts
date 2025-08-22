'server only';

import { database } from '@/lib/database/connection';
import { profiles, users } from '@/lib/database/schema';
import { ArtistManagerSelectData } from '@/lib/types';
import { and, asc, eq, inArray } from 'drizzle-orm';

export async function getArtistManagers(): Promise<ArtistManagerSelectData[]> {
  try {
    const results = await database
      .select({
        id: users.id,
        status: users.status,
        profileId: profiles.id,
        avatarUrl: profiles.avatarUrl,
        name: profiles.name,
        surname: profiles.surname,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(and(eq(users.role, 'artist-manager'), inArray(users.status, ['active', 'disabled'])))
      .orderBy(asc(profiles.name), asc(profiles.surname));

    return results;
  } catch (error) {
    console.error('[getArtistManagers] - Error: ', error);
    throw new Error('Recupero managers artisti non riuscito.');
  }
}
