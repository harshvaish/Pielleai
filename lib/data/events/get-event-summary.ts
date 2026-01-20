'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events, venues } from '@/lib/database/schema';
import { EventSummary } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function getEventSummary(eventId: number): Promise<EventSummary | null> {
  try {
    const result = await database
      .select({
        id: events.id,
        title: events.title,
        status: events.status,
        eventType: events.eventType as any,
        startDate: artistAvailabilities.startDate,
        endDate: artistAvailabilities.endDate,
        artist: {
          id: artists.id,
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
        },
        venue: {
          id: venues.id,
          name: venues.name,
          city: venues.city,
          address: venues.address,
        },
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .innerJoin(artists, eq(events.artistId, artists.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .where(eq(events.id, eventId))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error('[getEventSummary] - Error:', error);
    throw new Error('Recupero dettagli evento non riuscito.');
  }
}
