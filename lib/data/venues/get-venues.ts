'server only';

import { database } from '@/lib/database/connection';
import { venues } from '@/lib/database/schema';
import { VenueSelectData } from '@/lib/types';
import { asc, eq } from 'drizzle-orm';

export async function getVenues(): Promise<VenueSelectData[]> {
  try {
    const results = await database
      .select({
        id: venues.id,
        slug: venues.slug,
        status: venues.status,
        profileId: venues.id,
        avatarUrl: venues.avatarUrl,
        name: venues.name,
      })
      .from(venues)
      .where(eq(venues.status, 'active'))
      .orderBy(asc(venues.name));

    return results;
  } catch (error) {
    console.error('[getVenues] - Error: ', error);
    throw new Error('Recupero locali non riuscito.');
  }
}
