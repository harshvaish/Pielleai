'server only';

import { database } from '@/lib/database/connection';
import { profiles, users } from '@/lib/database/schema';
import { UserToApprove } from '@/lib/types';
import { asc, eq } from 'drizzle-orm';

export async function getUsersToApprove(): Promise<UserToApprove[]> {
  try {
    const results = await database
      .select({
        id: users.id,
        role: users.role,
        name: profiles.name,
        surname: profiles.surname,
        email: users.email,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.status, 'waiting-for-approval'))
      .orderBy(asc(profiles.name));

    return results;
  } catch (error) {
    console.error('[getLanguages] - Error: ', error);
    throw new Error('Recupero lingue non riuscito.');
  }
}
