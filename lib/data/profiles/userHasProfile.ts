'server only';

import { database } from '@/lib/database/connection';
import { profiles } from '@/lib/database/schema';
import { count, eq } from 'drizzle-orm';

export async function userHasProfile(uid: string): Promise<boolean> {
  try {
    const [result] = await database
      .select({
        count: count(),
      })
      .from(profiles)
      .where(eq(profiles.userId, uid))
      .limit(1);

    return result.count > 0;
  } catch (error) {
    console.error('[userHasProfile] - Error: ', error);
    return false;
  }
}
