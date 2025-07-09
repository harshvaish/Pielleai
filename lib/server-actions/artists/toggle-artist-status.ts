'use server';

import { UserStatus } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { artists } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function toggleArtistStatus(
  artistId: number,
  initialStatus: UserStatus
): Promise<ServerActionResponse<null>> {
  const newStatus: UserStatus =
    initialStatus === 'active' ? 'disabled' : 'active';

  try {
    await database
      .update(artists)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(artists.id, artistId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (err) {
    console.error('[toggleArtistStatus] - Error updating artist:', err);
    return {
      success: false,
      message: 'Aggiornamento artista non riuscito.',
      data: null,
    };
  }
}
