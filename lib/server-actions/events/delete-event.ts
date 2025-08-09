'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AppError } from '@/lib/classes/AppError';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { events } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

export async function deleteEvent(eventId: number): Promise<ServerActionResponse<null>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    await database.transaction(async (tx) => {
      await tx.delete(events).where(eq(events.id, eventId));
      // No other logic here—DB trigger handles conflicts & availability status.
    });

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[deleteEvent] error:', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Cancellazione evento non riuscita.',
      data: null,
    };
  }
}
