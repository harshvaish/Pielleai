'server only';

import { database } from '@/lib/database/connection';
import { artists, managerArtists } from '@/lib/database/schema';
import { ArtistSelectData } from '@/lib/types';
import { asc, eq, inArray } from 'drizzle-orm';

export async function getArtists(managerProfileId?: number): Promise<ArtistSelectData[]> {
  try {
    let managedArtistIds: number[] | undefined = undefined;

    if (managerProfileId) {
      const managedArtists = await database
        .select({ artistId: managerArtists.artistId })
        .from(managerArtists)
        .where(eq(managerArtists.managerProfileId, managerProfileId));

      managedArtistIds = [...new Set(managedArtists.map((r) => r.artistId))];
    }

    const results = await database
      .select({
        id: artists.id,
        slug: artists.slug,
        status: artists.status,
        avatarUrl: artists.avatarUrl,
        name: artists.name,
        surname: artists.surname,
        stageName: artists.stageName,
        tourManagerEmail: artists.tourManagerEmail,
        tourManagerName: artists.tourManagerName,
        tourManagerSurname: artists.tourManagerSurname,
        tourManagerPhone: artists.tourManagerPhone,
      })
      .from(artists)
      .where(managedArtistIds ? inArray(artists.id, managedArtistIds) : undefined)
      .orderBy(asc(artists.name), asc(artists.surname));

    return results;
  } catch (error) {
    console.error('[getArtists] - Error: ', error);
    throw new Error('Recupero artisti non riuscito.');
  }
}
