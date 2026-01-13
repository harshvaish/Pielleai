'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, events } from '@/lib/database/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

/**
 * Recomputes conflict status for all active events for an artist.
 * Must be called within a transaction.
 *
 * @param tx - Database transaction
 * @param artistId - ID of the artist to check
 */
export async function recomputeConflicts(
  tx: typeof database | Parameters<Parameters<typeof database.transaction>[0]>[0],
  artistId: number,
): Promise<void> {
  const ACTIVE_STATUSES = ['proposed', 'pre-confirmed'] as const;
  const now = new Date();

  await tx.execute(sql`SELECT pg_advisory_xact_lock(${artistId})`);

  const activeEvents = await tx
    .select({
      id: events.id,
      startDate: artistAvailabilities.startDate,
      endDate: artistAvailabilities.endDate,
    })
    .from(events)
    .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
    .where(and(eq(events.artistId, artistId), inArray(events.status, ACTIVE_STATUSES)));

  const conflictIds = new Set<number>();

  for (let i = 0; i < activeEvents.length; i += 1) {
    const current = activeEvents[i];
    for (let j = i + 1; j < activeEvents.length; j += 1) {
      const other = activeEvents[j];
      if (current.startDate < other.endDate && other.startDate < current.endDate) {
        conflictIds.add(current.id);
        conflictIds.add(other.id);
      }
    }
  }

  if (activeEvents.length > 0) {
    await tx
      .update(events)
      .set({ hasConflict: false, updatedAt: now })
      .where(and(eq(events.artistId, artistId), inArray(events.status, ACTIVE_STATUSES)));
  }

  if (conflictIds.size > 0) {
    await tx
      .update(events)
      .set({ hasConflict: true, updatedAt: now })
      .where(inArray(events.id, Array.from(conflictIds)));
  }
}
