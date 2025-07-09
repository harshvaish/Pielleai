'server only';

import { database } from '@/lib/database/connection';
import { zones } from '@/lib/database/schema';
import { Zone } from '@/lib/types';
import { asc } from 'drizzle-orm';

export async function getZones(): Promise<Zone[]> {
  try {
    const results = await database
      .select({
        id: zones.id,
        name: zones.name,
      })
      .from(zones)
      .orderBy(asc(zones.name));

    return results;
  } catch (error) {
    console.error('[getZones] - Error: ', error);
    throw new Error('Recupero aree di interesse non riuscito.');
  }
}
