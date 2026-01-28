'server only';

import { database } from '@/lib/database/connection';
import { eventGuests } from '@/lib/database/schema';
import { EventGuest } from '@/lib/types';
import { asc, eq } from 'drizzle-orm';

export async function getEventGuests(eventId: number): Promise<EventGuest[]> {
  try {
    return await database
      .select({
        id: eventGuests.id,
        eventId: eventGuests.eventId,
        fullName: eventGuests.fullName,
        email: eventGuests.email,
        originGroup: eventGuests.originGroup,
        colorTag: eventGuests.colorTag,
        status: eventGuests.status,
        invitedAt: eventGuests.invitedAt,
        createdAt: eventGuests.createdAt,
        updatedAt: eventGuests.updatedAt,
      })
      .from(eventGuests)
      .where(eq(eventGuests.eventId, eventId))
      .orderBy(asc(eventGuests.createdAt));
  } catch (error) {
    console.error('[getEventGuests] - Error:', error);
    throw new Error('Recupero invitati non riuscito.');
  }
}
