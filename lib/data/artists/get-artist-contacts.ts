'server only';

import { desc, eq } from 'drizzle-orm';

import { database } from '@/lib/database/connection';
import { artistContacts } from '@/lib/database/schema';
import type { ArtistContact } from '@/lib/types';

export async function getArtistContacts(artistId: number): Promise<ArtistContact[]> {
  try {
    const rows = await database
      .select({
        id: artistContacts.id,
        artistId: artistContacts.artistId,
        name: artistContacts.name,
        phone: artistContacts.phone,
        email: artistContacts.email,
        createdAt: artistContacts.createdAt,
        updatedAt: artistContacts.updatedAt,
      })
      .from(artistContacts)
      .where(eq(artistContacts.artistId, artistId))
      .orderBy(desc(artistContacts.createdAt));

    return rows as ArtistContact[];
  } catch (error) {
    console.error('[getArtistContacts] - Error:', error);
    return [];
  }
}

