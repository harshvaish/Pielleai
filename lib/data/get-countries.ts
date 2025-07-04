'server only';

import { database } from '@/lib/database/connection';
import { asc } from 'drizzle-orm';
import { countries } from '../database/schema';
import { Country } from '../types';

export async function getCountries(): Promise<Country[]> {
  try {
    const results = await database
      .select({
        id: countries.id,
        code: countries.code,
        name: countries.name,
        isEu: countries.isEu,
      })
      .from(countries)
      .orderBy(asc(countries.name));

    return results;
  } catch (error) {
    console.error('[getLanguages] - Error: ', error);
    throw new Error('Recupero paesi non riuscito.');
  }
}
