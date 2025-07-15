'use server';

import { UserStatus } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { venues } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function toggleVenueStatus(
  venueId: number,
  initialStatus: UserStatus
): Promise<ServerActionResponse<null>> {
  const newStatus: UserStatus =
    initialStatus === 'active' ? 'disabled' : 'active';

  try {
    await database
      .update(venues)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(venues.id, venueId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (err) {
    console.error('[toggleVenueStatus] - Error updating artist:', err);
    return {
      success: false,
      message: 'Aggiornamento locale non riuscito.',
      data: null,
    };
  }
}
