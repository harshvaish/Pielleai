'server only';

import { database } from '@/lib/database/connection';
import { professionals } from '@/lib/database/schema';
import { ProfessionalSelectData } from '@/lib/types';
import { asc } from 'drizzle-orm';

export async function getProfessionals(): Promise<ProfessionalSelectData[]> {
  try {
    return await database
      .select({
        id: professionals.id,
        fullName: professionals.fullName,
        role: professionals.role,
      })
      .from(professionals)
      .orderBy(asc(professionals.fullName));
  } catch (error) {
    console.error('[getProfessionals] - Error:', error);
    throw new Error('Recupero professionisti non riuscito.');
  }
}
