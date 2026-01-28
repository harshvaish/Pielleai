'server only';

import { database } from '@/lib/database/connection';
import {
  artists,
  events,
  artistAvailabilities,
  venues,
  profiles,
  users,
} from '@/lib/database/schema';
import { CalendarEvent, EventsCalendarFilters } from '@/lib/types';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { latestRevisionFilter } from './revision-helpers';

const venueManagerProfile = alias(profiles, 'venueManagerProfile');
const venueManagerUser = alias(users, 'venueManagerUser');

export async function getCalendarEvents({
  status,
  artistIds,
  venueIds,
  startDate,
  endDate,
}: EventsCalendarFilters): Promise<CalendarEvent[]> {
  try {
    const rangeWindow = sql`tstzrange(
                            ${startDate}::timestamptz,
                            ${endDate}::timestamptz,
                            '[)')`;

    // Build reusable filters
    const filters = and(
      latestRevisionFilter,
      status.length > 0 ? inArray(events.status, status) : undefined,
      artistIds.length > 0 ? inArray(events.artistId, artistIds.map(Number)) : undefined,
      venueIds.length > 0 ? inArray(events.venueId, venueIds.map(Number)) : undefined,
      rangeWindow ? sql`${artistAvailabilities.timeRange} && ${rangeWindow}` : undefined,
    );

    const eventsResult = await database
      .select({
        id: events.id,
        title: events.title,
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

        venueManager: {
          id: venueManagerUser.id,
          status: venueManagerUser.status,
          profileId: venueManagerProfile.id,
          avatarUrl: venueManagerProfile.avatarUrl,
          name: venueManagerProfile.name,
          surname: venueManagerProfile.surname,
        },

        status: events.status,
        hasConflict: events.hasConflict,
        hostedEvent: events.hostedEvent,
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .innerJoin(artists, eq(events.artistId, artists.id))
      .leftJoin(profiles, eq(events.artistManagerProfileId, profiles.id))
      .leftJoin(users, eq(profiles.userId, users.id))
      .leftJoin(venueManagerProfile, eq(venues.managerProfileId, venueManagerProfile.id))
      .leftJoin(venueManagerUser, eq(venueManagerProfile.userId, venueManagerUser.id))
      .where(filters)
      .orderBy(artistAvailabilities.startDate);

    //
    const parsedResult: CalendarEvent[] = eventsResult.map((event) => {
      return {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        hostedEvent: event.hostedEvent ?? false,
      };
    });

    return parsedResult;
  } catch (error) {
    console.error('[getCalendarEvents] - Error:', error);
    throw new Error('Recupero eventi calendario non riuscito.');
  }
}
