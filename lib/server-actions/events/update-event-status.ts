'use server';

import { EventStatus } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { events } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function updateEventStatus(eventId: number, status: EventStatus): Promise<ServerActionResponse<null>> {
  try {
    await database
      .update(events)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (err) {
    console.error('[updateEventStatus] - Error updating artist:', err);
    return {
      success: false,
      message: 'Aggiornamento stato evento non riuscito.',
      data: null,
    };
  }
}
