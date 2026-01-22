'server only';

import { database } from '@/lib/database/connection';
import { events } from '@/lib/database/schema';
import { desc, eq, or } from 'drizzle-orm';

export type EventRevisionContext = {
  eventId: number;
  masterEventId: number;
  latestEventId: number;
  latestRevisionNumber: number;
  isRevision: boolean;
};

export async function getEventRevisionContext(eventId: number): Promise<EventRevisionContext | null> {
  const [eventRow] = await database
    .select({
      id: events.id,
      masterEventId: events.masterEventId,
      revisionNumber: events.revisionNumber,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!eventRow) return null;

  const masterEventId = eventRow.masterEventId ?? eventRow.id;
  const [latestRow] = await database
    .select({
      id: events.id,
      revisionNumber: events.revisionNumber,
    })
    .from(events)
    .where(or(eq(events.id, masterEventId), eq(events.masterEventId, masterEventId)))
    .orderBy(desc(events.revisionNumber))
    .limit(1);

  if (!latestRow) return null;

  return {
    eventId: eventRow.id,
    masterEventId,
    latestEventId: latestRow.id,
    latestRevisionNumber: latestRow.revisionNumber ?? 0,
    isRevision: Boolean(eventRow.masterEventId),
  };
}
