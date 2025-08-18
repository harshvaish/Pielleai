'server only';

import { database } from '@/lib/database/connection';
import { artists, events, artistAvailabilities, venues, profiles, users } from '@/lib/database/schema';
import { CalendarEvent, EventsCalendarFilters } from '@/lib/types';
import { and, desc, eq, gt, inArray, lt } from 'drizzle-orm';

export async function getCalendarEvents({ status, artistIds, artistManagerIds, venueIds, startDate, endDate }: EventsCalendarFilters): Promise<CalendarEvent[]> {
  try {
    // Build reusable filters
    const filters = and(
      status.length > 0 ? inArray(events.status, status) : undefined,
      artistIds.length > 0 ? inArray(events.artistId, artistIds.map(Number)) : undefined,
      artistManagerIds.length > 0 ? inArray(events.artistManagerProfileId, artistManagerIds.map(Number)) : undefined,
      venueIds.length > 0 ? inArray(events.venueId, venueIds.map(Number)) : undefined,
      startDate && endDate ? and(lt(artistAvailabilities.startDate, endDate), gt(artistAvailabilities.endDate, startDate)) : undefined
    );

    const eventsResult = await database
      .select({
        id: events.id,
        start: artistAvailabilities.startDate,
        end: artistAvailabilities.endDate,

        artist: {
          id: artists.id,
          status: artists.status,
          slug: artists.slug,
          avatarUrl: artists.avatarUrl,
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
        },

        artistManager: {
          id: users.id,
          status: users.status,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
        },

        venue: {
          id: venues.id,
          status: venues.status,
          slug: venues.slug,
          avatarUrl: venues.avatarUrl,
          name: venues.name,
        },

        status: events.status,
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .innerJoin(artists, eq(events.artistId, artists.id))
      .leftJoin(profiles, eq(events.artistManagerProfileId, profiles.id))
      .leftJoin(users, eq(profiles.userId, users.id))
      .where(filters)
      .orderBy(desc(events.createdAt));

    // nullify missing relations
    const cleanedResult: CalendarEvent[] = eventsResult.map((event) => {
      const newObj = {
        ...event,
      } as CalendarEvent;

      if (!newObj.artistManager?.id) newObj.artistManager = null;
      return newObj;
    });

    return cleanedResult;
  } catch (error) {
    console.error('[getCalendarEvents] - Error:', error);
    throw new Error('Recupero eventi calendario non riuscito.');
  }
}
