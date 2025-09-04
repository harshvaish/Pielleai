'server only';

import { database } from '@/lib/database/connection';
import { profiles } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

export async function getUserProfileId(uid: string): Promise<number | undefined> {
  try {
    const results = await database
      .select({
        id: profiles.id,
      })
      .from(profiles)
      .where(eq(profiles.userId, uid))
      .limit(1);

    if (results.length > 0) {
      return results[0].id;
    }

    return undefined;
  } catch (error) {
    console.error('[getUserProfileId] - Error: ', error);
    return undefined;
  }
}
