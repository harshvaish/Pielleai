'server only';

import { database } from '@/lib/database/connection';
import { profileNotes } from '@/lib/database/schema';
import { ProfileNote, ServerActionResponse } from '@/lib/types';
import { and, desc, eq } from 'drizzle-orm';

export async function getProfileNotes({
  writerId,
  receiverProfileId,
}: {
  writerId: string;
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
      .where(
        and(
          eq(profileNotes.writerId, writerId),
          eq(profileNotes.receiverProfileId, receiverProfileId)
        )
      )
      .orderBy(desc(profileNotes.createdAt));

    return {
      success: true,
      message: null,
      data: notes,
    };
  } catch (err) {
    console.error('[updateUserNote] - Error updating note:', err);
    return {
      success: false,
      message: 'Inserimento nota non riuscito.',
      data: null,
    };
  }
}
