'server only';

import { database } from '@/lib/database/connection';
import { profiles, users } from '@/lib/database/schema';
import { UserToApprove } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function getProfile(uid: string): Promise<UserToApprove | null> {
  try {
    const results = await database
      .select({
        id: users.id,
        role: users.role,
        email: users.email,
        name: profiles.name,
        surname: profiles.surname,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.id, uid))
      .limit(1);

    if (results.length) return results[0];

    return null;
  } catch (error) {
    console.error('[getProfile] - Error: ', error);
    return null;
  }
}
