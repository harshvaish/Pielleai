'server only';

import { database } from '@/lib/database/connection';
import { profiles, users, venues } from '@/lib/database/schema';
import { VenueManagerSelectData, VenueSelectData } from '@/lib/types';
import { and, asc, eq, inArray } from 'drizzle-orm';

export async function getVenues(managerProfileId?: number): Promise<VenueSelectData[]> {
  try {
    let managedVenueIds: number[] | undefined = undefined;

    if (managerProfileId) {
      const managedVenues = await database
        .select({ venueId: venues.id })
        .from(venues)
        .where(eq(venues.managerProfileId, managerProfileId));

      managedVenueIds = [...new Set(managedVenues.map((r) => r.venueId))];
    }

    const results = await database
      .select({
        id: venues.id,
        slug: venues.slug,
        status: venues.status,
        profileId: venues.id,
        avatarUrl: venues.avatarUrl,
        name: venues.name,
        address: venues.address,
        company:venues.company,
        vatCode:venues.vatCode,
        manager: {
          id: users.id,
          profileId: profiles.id,
          status: users.status,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
        },
      })
      .from(venues)
      .leftJoin(profiles, eq(venues.managerProfileId, profiles.id))
      .leftJoin(users, eq(profiles.userId, users.id))
      .where(
        and(
          eq(venues.status, 'active'),
          managedVenueIds ? inArray(venues.id, managedVenueIds) : undefined,
        ),
      )
      .orderBy(asc(venues.name));

    const normalizedVenues = results.map((venue) => ({
      ...venue,
      manager: venue.manager?.id ? (venue.manager as VenueManagerSelectData) : null,
    }));

    return normalizedVenues;
  } catch (error) {
    console.error('[getVenues] - Error: ', error);
    throw new Error('Recupero locali non riuscito.');
  }
}
