'server only';

import { database } from '@/lib/database/connection';
import { venues } from '@/lib/database/schema';
import { and, asc, eq } from 'drizzle-orm';

export async function getManagedVenueIds(profileId: number): Promise<number[]> {
  try {
    const results = await database
      .select({
        id: venues.id,
      })
      .from(venues)
      .where(and(eq(venues.managerProfileId, profileId), eq(venues.status, 'active')))
      .orderBy(asc(venues.name));

    const managedVenueIds = [...results.map((r) => r.id)];

    return managedVenueIds;
  } catch (error) {
    console.error('[getVenues] - Error: ', error);
    throw new Error('Recupero locali non riuscito.');
  }
}
