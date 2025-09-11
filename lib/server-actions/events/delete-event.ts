'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AppError } from '@/lib/classes/AppError';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { events } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
import { idValidation } from '@/lib/validation/_general';
import { revalidateTag } from 'next/cache';

export async function deleteEvent(eventId: number): Promise<ServerActionResponse<null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      console.error('[deleteEvent] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = idValidation.safeParse(eventId);

    if (!validation.success) {
      console.error('[deleteEvent] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    await database.delete(events).where(eq(events.id, eventId));
    // No other logic here—DB trigger handles conflicts & availability status.

    revalidateTag('paginated-events');

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
