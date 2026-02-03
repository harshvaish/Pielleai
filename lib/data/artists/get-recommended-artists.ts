'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, events, venues } from '@/lib/database/schema';
import { RecommendedArtistData, RecommendedArtistsDebug } from '@/lib/types';
import { and, count, eq, inArray, sql } from 'drizzle-orm';

type GetRecommendedArtistsParams = {
  venueId: number;
  startDate: string | Date;
  endDate: string | Date;
  budget?: number | null;
  limit?: number;
  includeDebug?: boolean;
};

const EVENT_STATUSES_BLOCKING = ['proposed', 'pre-confirmed', 'confirmed'] as const;

const toDateValue = (value: string | Date): Date => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Date non valida.');
  }
  return date;
};

export async function getRecommendedArtists({
  venueId,
  startDate,
  endDate,
  budget,
  limit = 12,
  includeDebug = false,
}: GetRecommendedArtistsParams): Promise<{ data: RecommendedArtistData[]; debug?: RecommendedArtistsDebug }> {
  const start = toDateValue(startDate);
  const end = toDateValue(endDate);

  if (end.getTime() <= start.getTime()) {
    throw new Error('Intervallo date non valido.');
  }

  const [venue] = await database
    .select({
      id: venues.id,
      type: venues.type,
    })
    .from(venues)
    .where(eq(venues.id, venueId))
    .limit(1);

  if (!venue) {
    throw new Error('Locale non valido.');
  }

  const rangeWindow = sql`tstzrange(
    ${start.toISOString()}::timestamptz,
    ${end.toISOString()}::timestamptz,
    '[)'
  )`;

  const availabilityFilter = and(
    eq(artists.status, 'active'),
    eq(artists.capacityCategory, venue.type),
    sql`NOT EXISTS (
      select 1
      from ${artistAvailabilities} as aa
      left join ${events} as ev on ev.availability_id = aa.id
      where aa.artist_id = ${artists.id}
        and aa.time_range && ${rangeWindow}
        and ev.id is null
    )`,
    sql`NOT EXISTS (
      select 1
      from ${events} as ev
      inner join ${artistAvailabilities} as aa on ev.availability_id = aa.id
      where ev.artist_id = ${artists.id}
        and ev.status in (${sql.join(
          EVENT_STATUSES_BLOCKING.map((status) => sql`${status}`),
          sql`, `,
        )})
        and aa.time_range && ${rangeWindow}
    )`,
  );

  const recommendedCandidates = await database
    .select({
      id: artists.id,
      slug: artists.slug,
      avatarUrl: artists.avatarUrl,
      stageName: artists.stageName,
      bio: artists.bio,
      tiktokUrl: artists.tiktokUrl,
      facebookUrl: artists.facebookUrl,
      instagramUrl: artists.instagramUrl,
      xUrl: artists.xUrl,
    })
    .from(artists)
    .where(availabilityFilter)
    .limit(limit * 4);

  const normalizedBudget =
    budget === null || budget === undefined || Number.isNaN(Number(budget))
      ? null
      : Number(budget);

  let debug: RecommendedArtistsDebug | undefined = undefined;
  let debugCandidateIds: number[] = [];

  if (includeDebug) {
    const [
      [totalActiveRow],
      [capacityMatchRow],
      [availabilityOkRow],
      [blockedAvailabilityRow],
      [eventConflictRow],
      availabilityCandidates,
    ] = await Promise.all([
      database.select({ count: count() }).from(artists).where(eq(artists.status, 'active')),
      database
        .select({ count: count() })
        .from(artists)
        .where(and(eq(artists.status, 'active'), eq(artists.capacityCategory, venue.type))),
      database.select({ count: count() }).from(artists).where(availabilityFilter),
      database
        .select({
          count: sql<number>`count(distinct ${artistAvailabilities.artistId})`,
        })
        .from(artistAvailabilities)
        .leftJoin(events, eq(events.availabilityId, artistAvailabilities.id))
        .innerJoin(artists, eq(artists.id, artistAvailabilities.artistId))
        .where(
          and(
            eq(artists.status, 'active'),
            eq(artists.capacityCategory, venue.type),
            sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
            sql`${events.id} is null`,
          ),
        ),
      database
        .select({
          count: sql<number>`count(distinct ${events.artistId})`,
        })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .innerJoin(artists, eq(artists.id, events.artistId))
        .where(
          and(
            eq(artists.status, 'active'),
            eq(artists.capacityCategory, venue.type),
            inArray(events.status, EVENT_STATUSES_BLOCKING),
            sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
          ),
        ),
      database.select({ id: artists.id }).from(artists).where(availabilityFilter),
    ]);

    debugCandidateIds = availabilityCandidates.map((row) => row.id);

    debug = {
      totalActive: Number(totalActiveRow?.count ?? 0),
      capacityMatch: Number(capacityMatchRow?.count ?? 0),
      availabilityOk: Number(availabilityOkRow?.count ?? 0),
      blockedAvailabilityCount: Number(blockedAvailabilityRow?.count ?? 0),
      eventConflictCount: Number(eventConflictRow?.count ?? 0),
      candidatesBeforeBudget: debugCandidateIds.length,
      cachetKnownCount: 0,
      missingCachetCount: 0,
      budgetOk: 0,
      budget: normalizedBudget,
      venueType: venue.type,
    };
  }

  if (recommendedCandidates.length === 0) {
    return { data: [], debug };
  }

  const candidateIds = recommendedCandidates.map((artist) => artist.id);

  const cachetLookupIds =
    includeDebug && debugCandidateIds.length > 0 ? debugCandidateIds : candidateIds;

  const cachetRows = await database.execute(
    sql`
      select distinct on (artist_id)
        artist_id as "artistId",
        mo_cost as "moCost"
      from events
      where artist_id in (${sql.join(cachetLookupIds.map((id) => sql`${id}`), sql`, `)})
        and mo_cost is not null
      order by artist_id, created_at desc
    `,
  );

  const cachetByArtistId = new Map<number, number>();
  for (const row of cachetRows.rows as Array<{ artistId: number; moCost: string | number | null }>) {
    const cost = row.moCost === null ? null : Number(row.moCost);
    if (cost !== null && !Number.isNaN(cost)) {
      cachetByArtistId.set(Number(row.artistId), cost);
    }
  }

  if (includeDebug && debug) {
    const cachetKnownCount = cachetLookupIds.filter((id) => cachetByArtistId.has(id)).length;
    const missingCachetCount = cachetLookupIds.length - cachetKnownCount;
    const budgetOk = normalizedBudget
      ? cachetLookupIds.filter((id) => {
          const cost = cachetByArtistId.get(id);
          return cost !== undefined && cost <= normalizedBudget;
        }).length
      : cachetLookupIds.length;

    debug.cachetKnownCount = cachetKnownCount;
    debug.missingCachetCount = missingCachetCount;
    debug.budgetOk = budgetOk;
  }

  const filtered = recommendedCandidates.filter((artist) => {
    if (normalizedBudget === null) return true;
    const cachet = cachetByArtistId.get(artist.id);
    if (cachet === undefined) return false;
    return cachet <= normalizedBudget;
  });

  const sorted = normalizedBudget
    ? [...filtered].sort((a, b) => {
        const cachetA = cachetByArtistId.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const cachetB = cachetByArtistId.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return Math.abs(normalizedBudget - cachetA) - Math.abs(normalizedBudget - cachetB);
      })
    : filtered.sort((a, b) => a.stageName.localeCompare(b.stageName));

  return { data: sorted.slice(0, limit), debug };
}
