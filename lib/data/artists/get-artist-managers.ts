'server only';

import { database } from '@/lib/database/connection';
import { managerArtists, profiles, users } from '@/lib/database/schema';
import { ArtistManagerSelectData } from '@/lib/types';
import { and, asc, eq } from 'drizzle-orm';

export async function getArtistManagers(
  artistId: number
): Promise<ArtistManagerSelectData[]> {
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
      .innerJoin(
        managerArtists,
        eq(profiles.id, managerArtists.managerProfileId)
      )
      .where(
        and(
          eq(users.role, 'artist-manager'),
          eq(managerArtists.artistId, artistId)
        )
      )
      .orderBy(asc(profiles.name), asc(profiles.surname));

    return results;
  } catch (error) {
    console.error('[getArtistManagers] - Error: ', error);
    throw new Error('Recupero managers artisti non riuscito.');
  }
}
