'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { managerArtists } from '@/lib/database/schema';

export const removeManagedArtist = async ({
  managerProfileId,
  artistId,
}: {
  managerProfileId: number;
  artistId: number;
}): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[removeManagedArtist] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[removeManagedArtist] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  try {
    const result = await database
      .delete(managerArtists)
      .where(
        and(
          eq(managerArtists.managerProfileId, managerProfileId),
          eq(managerArtists.artistId, artistId)
        )
      );

    const deletedRows = result.rowCount;

    if (!deletedRows) {
      return {
        success: false,
        message: 'Artista non trovato.',
        data: null,
      };
    }

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[removeManagedArtist] transaction failed', error);
    return {
      success: false,
      message: 'Rimozione artista gestito non riuscita.',
      data: null,
    };
  }
};
