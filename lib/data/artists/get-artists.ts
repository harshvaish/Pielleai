'server only';

import { database } from '@/lib/database/connection';
import { artists } from '@/lib/database/schema';
import { ArtistSelectData } from '@/lib/types';
import { asc } from 'drizzle-orm';

export async function getArtists(): Promise<ArtistSelectData[]> {
  try {
    const results = await database
      .select({
        id: artists.id,
        slug: artists.slug,
        status: artists.status,
        profileId: artists.id,
        avatarUrl: artists.avatarUrl,
        name: artists.name,
        surname: artists.surname,
        stageName: artists.stageName,
      })
      .from(artists)
      .orderBy(asc(artists.name), asc(artists.surname));

    return results;
  } catch (error) {
    console.error('[getArtists] - Error: ', error);
    throw new Error('Recupero artisti non riuscito.');
  }
}
