'server only';

import { AppError } from '@/lib/classes/AppError';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { database } from '@/lib/database/connection';
import { managerArtists } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';
import { and, count, eq } from 'drizzle-orm';

export async function ensureArtistBlacklistAccess(artistId: number) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    console.error('[ensureArtistBlacklistAccess] - Error: unauthorized', session);
    throw new AppError('Non sei autenticato.');
  }

  if (user.role !== 'admin' && user.role !== 'artist-manager') {
    console.error('[ensureArtistBlacklistAccess] - Error: unauthorized', session);
    throw new AppError('Non sei autorizzato.');
  }

  if (user.role === 'artist-manager') {
    const profileId = await getUserProfileIdCached(user.id);
    if (!profileId) {
      throw new AppError('Non sei autorizzato.');
    }

    const [managed] = await database
      .select({ count: count() })
      .from(managerArtists)
      .where(
        and(
          eq(managerArtists.managerProfileId, profileId),
          eq(managerArtists.artistId, artistId),
        ),
      )
      .limit(1);

    if (!managed || managed.count === 0) {
      throw new AppError('Non sei autorizzato.');
    }
  }

  return user;
}
