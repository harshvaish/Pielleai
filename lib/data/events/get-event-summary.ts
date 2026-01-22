'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events, venues, profiles, users } from '@/lib/database/schema';
import { EventSummary } from '@/lib/types';
import { eq, sql } from 'drizzle-orm';

export async function getEventSummary(eventId: number): Promise<EventSummary | null> {
  try {
    const artistManagerProfiles = sql`artist_manager_profiles`;
    const artistManagerUsers = sql`artist_manager_users`;
    const venueManagerProfiles = sql`venue_manager_profiles`;
    const venueManagerUsers = sql`venue_manager_users`;

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
          slug: artists.slug,
        },
        venue: {
          id: venues.id,
          name: venues.name,
          city: venues.city,
          address: venues.address,
          slug: venues.slug,
        },
        artistManager: sql<{
          id: string;
          profileId: number;
          name: string;
          surname: string;
        } | null>`
          CASE
            WHEN ${events.artistManagerProfileId} IS NOT NULL THEN
              json_build_object(
                'id', artist_manager_users.id,
                'profileId', artist_manager_profiles.id,
                'name', artist_manager_profiles.name,
                'surname', artist_manager_profiles.surname
              )
            ELSE NULL
          END
        `,
        venueManager: sql<{
          id: string;
          profileId: number;
          name: string;
          surname: string;
        } | null>`
          CASE
            WHEN ${venues.managerProfileId} IS NOT NULL THEN
              json_build_object(
                'id', venue_manager_users.id,
                'profileId', venue_manager_profiles.id,
                'name', venue_manager_profiles.name,
                'surname', venue_manager_profiles.surname
              )
            ELSE NULL
          END
        `,
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .innerJoin(artists, eq(events.artistId, artists.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .leftJoin(
        sql`${profiles} AS artist_manager_profiles`,
        eq(events.artistManagerProfileId, sql`artist_manager_profiles.id`)
      )
      .leftJoin(
        sql`${users} AS artist_manager_users`,
        eq(sql`artist_manager_profiles.user_id`, sql`artist_manager_users.id`)
      )
      .leftJoin(
        sql`${profiles} AS venue_manager_profiles`,
        eq(venues.managerProfileId, sql`venue_manager_profiles.id`)
      )
      .leftJoin(
        sql`${users} AS venue_manager_users`,
        eq(sql`venue_manager_profiles.user_id`, sql`venue_manager_users.id`)
      )
      .where(eq(events.id, eventId))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error('[getEventSummary] - Error:', error);
    throw new Error('Recupero dettagli evento non riuscito.');
  }
}
