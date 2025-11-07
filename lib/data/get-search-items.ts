'server-only';

import { database } from '@/lib/database/connection';
import { SearchItem } from '../types';
import { and, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { union } from 'drizzle-orm/pg-core';
import { profiles, artists, users, venues } from '../database/schema';

export async function getSearchItems(search: string): Promise<SearchItem[]> {
  // build %term% for ILIKE (trim to avoid accidental leading/trailing spaces)
  const term = `%${search.trim()}%`;

  try {
    const profilesQuery = database
      .select({
        avatarUrl: profiles.avatarUrl,
        fullName: sql<string>`${profiles.name} || ' ' || ${profiles.surname}`,
        path: sql<string>`CASE
                            WHEN ${users.role} = 'artist-manager' THEN '/manager-artisti/' || ${profiles.userId}
                            ELSE '/promoter-locali/' || ${profiles.userId}
                          END`,
        role: sql<string>`CASE
                            WHEN ${users.role} = 'artist-manager' THEN 'Manager artisti'
                            ELSE 'Promoter locali'
                          END`,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(
        and(
          inArray(users.role, ['artist-manager', 'venue-manager']),
          or(ilike(profiles.name, term), ilike(profiles.surname, term)),
        ),
      );

    const artistsQuery = database
      .select({
        avatarUrl: artists.avatarUrl,
        fullName: artists.stageName,
        path: sql<string>`'/artisti/' || ${artists.slug}`,
        role: sql<string>`'Artista'`,
      })
      .from(artists)
      .where(
        or(ilike(artists.name, term), ilike(artists.surname, term), ilike(artists.stageName, term)),
      );

    const venuesQuery = database
      .select({
        avatarUrl: venues.avatarUrl,
        fullName: venues.name,
        path: sql<string>`'/locali/' || ${venues.slug}`,
        role: sql<string>`'Locale'`,
      })
      .from(venues)
      .where(ilike(venues.name, term));

    // UNION the two queries, then select/limit
    const result = await union(profilesQuery, artistsQuery, venuesQuery).limit(5);

    return result as SearchItem[];
  } catch (error) {
    console.error('[getSearchItems] - Error:', error);
    throw new Error('Recupero degli item per la ricerca non riuscito.');
  }
}
