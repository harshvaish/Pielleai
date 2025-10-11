'server only';

import { database } from '@/lib/database/connection';
import { events } from '@/lib/database/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

/**
 * Recomputes conflict status for all events on a given availability.
 * Must be called within a transaction.
 *
 * @param tx - Database transaction
 * @param availabilityId - ID of the availability to check
 */
export async function recomputeConflicts(
  tx: typeof database | Parameters<Parameters<typeof database.transaction>[0]>[0],
  availabilityId: number,
): Promise<void> {
  // Use PostgreSQL advisory lock to prevent race conditions
  // This ensures only one transaction can process conflicts for this availability at a time
  await tx.execute(sql`SELECT pg_advisory_xact_lock(${availabilityId})`);

  // Get all active (non-finalized) events on this availability
  const activeEvents = await tx
    .select({ id: events.id })
    .from(events)
    .where(
      and(
        eq(events.availabilityId, availabilityId),
        inArray(events.status, ['proposed', 'pre-confirmed']),
      ),
    );

  const hasConflicts = activeEvents.length > 1;
  const now = new Date();

  await tx
    .update(events)
    .set({
      hasConflict: hasConflicts,
      updatedAt: now,
    })
    .where(eq(events.availabilityId, availabilityId));
}
