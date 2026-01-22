'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { recomputeConflicts } from '@/lib/data/events/recompute-conflicts';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, events, artists, venues } from '@/lib/database/schema';
import { EventStatus, ServerActionResponse } from '@/lib/types';
import { hasRole } from '@/lib/utils';
import { eventStatusEnumValidation, idValidation } from '@/lib/validation/_general';
import { isBefore } from 'date-fns';
import { and, eq, ne, count, inArray, sql } from 'drizzle-orm';
import { z } from 'zod/v4';
import { sendEventConfirmedEmail } from '../send-event-confirmed-email';
import { buildEventProtocolNumber } from '@/lib/utils/event-revisions';

export async function updateEventStatus(
  eventId: number,
  newStatus: EventStatus,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateEventStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'artist-manager', 'venue-manager'])) {
      console.error('[updateEventStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      eventId: idValidation,
      newStatus: eventStatusEnumValidation,
    });

    const validation = schema.safeParse({ eventId, newStatus });

    if (!validation.success) {
      console.error('[updateEventStatus] - Error: ', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const now = new Date();

    // Fetch event + availability + artist + venue for email notification
    const [oldEvent] = await database
      .select({
        id: events.id,
        status: events.status,
        masterEventId: events.masterEventId,
        protocolNumber: events.protocolNumber,
        artistId: events.artistId,

        artist: {
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
        },

        venue: {
          name: venues.name,
          address: venues.address,
        },

        availability: {
          id: artistAvailabilities.id,
          status: artistAvailabilities.status,
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
        },
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .innerJoin(artists, eq(events.artistId, artists.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .where(eq(events.id, eventId))
      .limit(1);

    if (!oldEvent) throw new AppError('Evento non trovato.');
    if (isBefore(oldEvent.availability.endDate, now)) throw new AppError('Evento scaduto.');

    const rangeWindow = sql`tstzrange(${oldEvent.availability.startDate}::timestamptz, ${oldEvent.availability.endDate}::timestamptz, '[)')`;

    if (oldEvent.status !== newStatus && newStatus === 'confirmed') {
      const [alreadyConfirmed] = await database
        .select({ count: count() })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .where(
          and(
            ne(events.id, eventId),
            eq(events.artistId, oldEvent.artistId),
            eq(events.status, 'confirmed'),
            sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
          ),
        )
        .limit(1);

      if (alreadyConfirmed.count > 0) {
        throw new AppError('Un altro evento è già confermato per questa disponibilità.');
      }
    }

    await database.transaction(async (tx) => {
      // STEP 1: HANDLE EVENT --------------------------------------------------------
      const protocolNumber =
        newStatus === 'ended' && !oldEvent.protocolNumber && !oldEvent.masterEventId
          ? buildEventProtocolNumber(oldEvent.id, 0)
          : undefined;

      await tx
        .update(events)
        .set({
          status: newStatus,
          updatedAt: now,
          ...(protocolNumber ? { protocolNumber } : {}),
        })
        .where(eq(events.id, eventId));

      // STEP 3: HANDLE CONFLICTS --------------------------------------------------------
      // If confirming, reject all conflicts
      if (newStatus === 'confirmed') {
        await tx
          .update(events)
          .set({ status: 'rejected', updatedAt: now })
          .where(
            and(
              ne(events.id, eventId),
              inArray(events.status, ['proposed', 'pre-confirmed']),
              eq(events.artistId, oldEvent.artistId),
              sql`${events.availabilityId} in (select id from artist_availabilities where time_range && ${rangeWindow})`,
            ),
          );
      }

      // Always recompute conflicts after any status change
      await recomputeConflicts(tx, oldEvent.artistId);
    });

    // STEP 4: SEND EMAIL NOTIFICATION IF STATUS IS NOW CONFIRMED --------------------------------
    if (newStatus === 'confirmed' && oldEvent.status !== 'confirmed') {
      const artistName =
        oldEvent.artist.stageName || `${oldEvent.artist.name} ${oldEvent.artist.surname}`.trim();

      // Send email notification asynchronously (don't block the response)
      sendEventConfirmedEmail({
        eventId: oldEvent.id,
        artistName,
        venueName: oldEvent.venue.name,
        venueAddress: oldEvent.venue.address || 'Non specificato',
        startDate: oldEvent.availability.startDate,
        endDate: oldEvent.availability.endDate,
      }).catch((error) => {
        // Log error but don't fail the entire operation
        console.error('[updateEventStatus] - Failed to send notification email:', error);
      });
    }

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[updateEventStatus] - Error:', error);
    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Aggiornamento stato evento non riuscito.',
      data: null,
    };
  }
}
