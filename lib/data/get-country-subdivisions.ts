'server only';

import { database } from '@/lib/database/connection';
import { asc, eq } from 'drizzle-orm';
import { subdivisions } from '../database/schema';
import { Subdivision } from '../types';

export async function getCountrySubdivisions(
  countryId: number
): Promise<Subdivision[]> {
  try {
    const results = await database
      .select({ id: subdivisions.id, name: subdivisions.name })
      .from(subdivisions)
      .where(eq(subdivisions.countryId, countryId))
      .orderBy(asc(subdivisions.name));
    return results;
  } catch (error) {
    console.error('[getCountrySubdivisions] - Error: ', error);
    throw new Error('Recupero province non riuscito.');
  }
}
