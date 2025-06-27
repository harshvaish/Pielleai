'server only';

import { database } from '@/lib/database/connection';
import { asc } from 'drizzle-orm';
import { languages } from '../database/schema';
import { Language } from '../types';

export async function getLanguages(): Promise<Language[]> {
  try {
    const results = await database
      .select({ id: languages.id, name: languages.name })
      .from(languages)
      .orderBy(asc(languages.name));

    return results;
  } catch (error) {
    console.error('[getLanguages] - Error: ', error);
    throw new Error('Recupero lingue non riuscito.');
  }
}
