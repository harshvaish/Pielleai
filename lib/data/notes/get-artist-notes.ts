'server only';

import { database } from '@/lib/database/connection';
import { artistNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { desc, eq } from 'drizzle-orm';

export async function getArtistNotes({
  artistId,
}: {
  artistId: number;
}): Promise<ServerActionResponse<ProfileNote[] | null>> {
  try {
    const notes = await database
      .select({
        id: artistNotes.id,
        content: artistNotes.content,
        createdAt: artistNotes.createdAt,
      })
      .from(artistNotes)
      .where(eq(artistNotes.artistId, artistId))
      .orderBy(desc(artistNotes.createdAt));

    return {
      success: true,
      message: null,
      data: notes,
    };
  } catch (err) {
    console.error('[getArtistNotes] - Error updating note:', err);
    return {
      success: false,
      message: 'Recupero note artista non riuscito.',
      data: null,
    };
  }
}
