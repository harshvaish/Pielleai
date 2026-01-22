import { sql } from 'drizzle-orm';
import { events } from '@/lib/database/schema';

export const latestRevisionFilter = sql`
  ${events.revisionNumber} = (
    select max(e2.revision_number)
    from events e2
    where coalesce(e2.master_event_id, e2.id) = coalesce(${events.masterEventId}, ${events.id})
  )
`;
