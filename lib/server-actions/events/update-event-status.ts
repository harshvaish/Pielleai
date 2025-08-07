'use server';

import { AppError } from '@/lib/classes/AppError';
import { EventStatus } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, events } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { and, eq, gt, ne, inArray, or, lt, sql, count } from 'drizzle-orm';

export async function updateEventStatus(eventId: number, newStatus: EventStatus): Promise<ServerActionResponse<null>> {
  try {
    const now = new Date();

    const [event] = await database
      .select({
        id: events.id,
        status: events.status,
        venueId: events.venueId,
        availabilityId: events.availabilityId,
        startDate: artistAvailabilities.startDate,
        endDate: artistAvailabilities.endDate,
        availabilityStatus: artistAvailabilities.status,
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      throw new AppError('Evento non trovato.');
    }

    if (event.endDate < now) {
      throw new AppError('Evento scaduto.');
    }

    await database.transaction(async (tx) => {
      // Block if trying to confirm and another confirmed event already exists
      if (newStatus === 'confirmed') {
        const [availabilityAlreadyConfirmed] = await tx
          .select({ id: events.id })
          .from(events)
          .where(and(eq(events.availabilityId, event.availabilityId), eq(events.status, 'confirmed'), ne(events.id, eventId)));

        if (availabilityAlreadyConfirmed) {
          throw new AppError('Un altro evento è già confermato per questa disponibilità artista.');
        }

        const [venueAlreadyConfirmed] = await tx
          .select({ id: events.id })
          .from(events)
          .where(
            and(
              eq(events.venueId, event.venueId),
              ne(events.id, eventId),
              eq(events.status, 'confirmed'),
              lt(artistAvailabilities.startDate, event.endDate),
              gt(artistAvailabilities.endDate, event.startDate)
            )
          );

        if (venueAlreadyConfirmed) {
          throw new AppError('Un altro evento nello stesso range di date è già confermato per questo locale.');
        }

        // Set availability to booked
        await tx.update(artistAvailabilities).set({ status: 'booked', updatedAt: now }).where(eq(artistAvailabilities.id, event.availabilityId));
      }

      // Block if trying to activate event on availability already booked
      if (['confirmed', 'proposed', 'pre-confirmed'].includes(newStatus) && event.availabilityStatus === 'booked') {
        throw new AppError('Questa disponibilità è gia prenotata da un evento confermato.');
      }

      // check for conflicts
      const conflicts = await tx
        .select({
          id: events.id,
          venueId: events.venueId,
          availabilityId: events.availabilityId,
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
        })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .where(
          and(
            ne(events.id, eventId),
            inArray(events.status, ['proposed', 'pre-confirmed', 'confirmed', 'conflict']),
            or(
              eq(events.availabilityId, event.availabilityId),
              and(eq(events.venueId, event.venueId), lt(artistAvailabilities.startDate, event.endDate), gt(artistAvailabilities.endDate, event.startDate))
            )
          )
        );

      console.dir(conflicts, { depths: null });

      // Block if trying to conflict without an existing conflict
      if (newStatus === 'conflict' && conflicts.length === 0) {
        throw new AppError("Questo evento non è in conflitto con nessun'altro evento.");
      }

      // Update the event status
      await tx.update(events).set({ status: newStatus, updatedAt: now }).where(eq(events.id, eventId));

      // update new conflicts
      if (['confirmed', 'proposed', 'pre-confirmed', 'conflict'].includes(newStatus)) {
        // Conflict logic (same availability or overlapping same venue)
        await tx
          .update(events)
          .set({
            previousStatus: events.status,
            status: 'conflict',
            updatedAt: now,
          })
          .where(
            and(
              newStatus === 'confirmed' ? ne(events.id, eventId) : undefined,
              inArray(events.status, ['proposed', 'pre-confirmed']),
              or(
                eq(events.availabilityId, event.availabilityId),
                and(
                  eq(events.venueId, event.venueId),
                  inArray(
                    events.availabilityId,
                    tx
                      .select({ id: artistAvailabilities.id })
                      .from(artistAvailabilities)
                      .where(and(lt(artistAvailabilities.startDate, event.endDate), gt(artistAvailabilities.endDate, event.startDate)))
                  )
                )
              )
            )
          );
      }

      // If event was rejected remove the conflicts if possible
      if (newStatus === 'rejected' && conflicts.length > 0) {
        for (const conflict of conflicts) {
          // Check if this event is still in conflict with any others
          const [conflictStillValid] = await tx
            .select({ count: count() })
            .from(events)
            .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
            .where(
              and(
                ne(events.id, conflict.id),
                inArray(events.status, ['proposed', 'pre-confirmed', 'confirmed', 'conflict']),
                or(
                  eq(events.availabilityId, conflict.availabilityId),
                  and(eq(events.venueId, conflict.venueId), lt(artistAvailabilities.startDate, conflict.endDate), gt(artistAvailabilities.endDate, conflict.startDate))
                )
              )
            );

          // If no other conflicting event remains, restore its previous status
          if (conflictStillValid.count === 0) {
            await tx
              .update(events)
              .set({
                status: sql`COALESCE(${events.previousStatus}, 'proposed')`,
                previousStatus: null,
                updatedAt: now,
              })
              .where(eq(events.id, conflict.id));
          }
        }

        // After restoring, if no confirmed event is left on that availability, set it as available
        const [confirmedStillPresent] = await tx
          .select({ count: count() })
          .from(events)
          .where(and(eq(events.availabilityId, event.availabilityId), eq(events.status, 'confirmed')));

        if (confirmedStillPresent.count === 0) {
          await tx.update(artistAvailabilities).set({ status: 'available', updatedAt: now }).where(eq(artistAvailabilities.id, event.availabilityId));
        }
      }
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateEventStatus] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento stato evento non riuscito.',
      data: null,
    };
  }
}
