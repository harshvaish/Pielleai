'server only';

import { database } from '@/lib/database/connection';
import { profileNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { desc, eq } from 'drizzle-orm';

export async function getProfileNotes({
  receiverProfileId,
}: {
  receiverProfileId: number;
}): Promise<ServerActionResponse<ProfileNote[] | null>> {
  try {
    const notes = await database
      .select({
        id: profileNotes.id,
        content: profileNotes.content,
        createdAt: profileNotes.createdAt,
      })
      .from(profileNotes)
      .where(eq(profileNotes.receiverProfileId, receiverProfileId))
      .orderBy(desc(profileNotes.createdAt));

    return {
      success: true,
      message: null,
      data: notes,
    };
  } catch (err) {
    console.error('[getProfileNotes] - Error updating note:', err);
    return {
      success: false,
      message: 'Recupero note utente non riuscito.',
      data: null,
    };
  }
}
