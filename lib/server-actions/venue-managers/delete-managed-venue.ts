'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { venues } from '@/lib/database/schema';

export const deleteManagedVenue = async ({
  managerProfileId,
  venueId,
}: {
  managerProfileId: number;
  venueId: number;
}): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[removeManagedVenue] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[removeManagedVenue] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  try {
    const result = await database
      .delete(venues)
      .where(
        and(
          eq(venues.managerProfileId, managerProfileId),
          eq(venues.id, venueId)
        )
      );

    const deletedRows = result.rowCount;

    if (!deletedRows) {
      return {
        success: false,
        message: 'Locale non trovato.',
        data: null,
      };
    }

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[removeManagedVenue] transaction failed', error);
    return {
      success: false,
      message: 'Rimozione locale non riuscita.',
      data: null,
    };
  }
};
