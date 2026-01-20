'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq, inArray, sql } from 'drizzle-orm';
import { artists, venues, events, artistAvailabilities } from '@/lib/database/schema';
import { eventRequestFormSchema, EventRequestFormSchema } from '@/lib/validation/event-form-schema';
import { isBefore } from 'date-fns';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { recomputeConflicts } from '@/lib/data/events/recompute-conflicts';
import { generateEventTitle } from '@/lib/utils/generate-event-title';

export const createEventRequest = async (
  data: EventRequestFormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createEventRequest] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'venue-manager') {
      console.error('[createEventRequest] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = eventRequestFormSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createEventRequest] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { artistId, venueId, availability } = validation.data;
    const now = new Date();

    if (!artistId) {
      throw new AppError('Artista selezionato non valido.');
    }

    if (!venueId) {
      throw new AppError('Locale selezionato non valido.');
    }

    if (!availability.startDate || !availability.endDate) {
      throw new AppError('Seleziona una data e un orario validi.');
    }

    if (isBefore(availability.endDate, availability.startDate)) {
      throw new AppError("L'orario di fine deve essere successivo all'orario di inizio.");
    }

    if (isBefore(availability.startDate, now)) {
      throw new AppError('La data selezionata è già iniziata e quindi scaduta.');
    }

    const [[artistCheck], [venueCheck]] = await Promise.all([
      database.select({ count: count() }).from(artists).where(eq(artists.id, artistId)).limit(1),
      database.select({ count: count() }).from(venues).where(eq(venues.id, venueId)).limit(1),
    ]);

    if (artistCheck.count === 0) {
      throw new AppError('Artista selezionato non valido.');
    }

    if (venueCheck.count === 0) {
      throw new AppError('Locale selezionato non valido.');
    }

    const rangeWindow = sql`tstzrange(${availability.startDate}::timestamptz, ${availability.endDate}::timestamptz, '[)')`;
    const [[blockedCount], [overlapCount]] = await Promise.all([
      database
        .select({ count: count() })
        .from(artistAvailabilities)
        .leftJoin(events, eq(events.availabilityId, artistAvailabilities.id))
        .where(
          and(
            eq(artistAvailabilities.artistId, artistId),
            sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
            sql`${events.id} is null`,
          ),
        ),
      database
        .select({ count: count() })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .where(
          and(
            eq(events.artistId, artistId),
            inArray(events.status, ['proposed', 'pre-confirmed', 'confirmed']),
            sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
          ),
        ),
    ]);

    if (blockedCount.count > 0) {
      throw new AppError('Il periodo selezionato è in conflitto con un blocco di indisponibilità.');
    }

    if (overlapCount.count > 0) {
      throw new AppError('Il periodo selezionato è in conflitto con un altro evento.');
    }

    // Fetch artist and venue details for title generation
    const [[artistDetails], [venueDetails]] = await Promise.all([
      database
        .select({
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
        })
        .from(artists)
        .where(eq(artists.id, artistId))
        .limit(1),
      database
        .select({
          name: venues.name,
        })
        .from(venues)
        .where(eq(venues.id, venueId))
        .limit(1),
    ]);

    if (!artistDetails || !venueDetails) {
      throw new AppError('Impossibile recuperare i dettagli per generare il titolo.');
    }

    // Generate event title
    const artistName =
      artistDetails.stageName || `${artistDetails.name} ${artistDetails.surname}`.trim();
    const eventTitle = generateEventTitle(
      artistName,
      venueDetails.name,
      availability.startDate,
      availability.endDate,
    );

    await database.transaction(async (tx) => {
      const [newAvailability] = await tx
        .insert(artistAvailabilities)
        .values({
          artistId,
          startDate: availability.startDate,
          endDate: availability.endDate,
          status: 'booked',
        })
        .returning({ id: artistAvailabilities.id });

      if (!newAvailability?.id) {
        throw new AppError('Inserimento nuova disponibilità non riuscito.');
      }

      const [eventResult] = await tx
        .insert(events)
        .values({
          title: eventTitle,
          artistId: artistId,
          availabilityId: newAvailability.id,
          venueId: venueId,
          status: 'proposed',
          paymentDate: validation.data.paymentDate || null,
        })
        .returning({ id: events.id });

      const newEventId = eventResult?.id;

      if (!newEventId) {
        throw new AppError('Inserimento evento non riuscito.');
      }

      // HANDLE CONFLICTS --------------------------------------------------------
      await recomputeConflicts(tx, artistId);
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[createEventRequest] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Creazione evento non riuscita.',
      data: null,
    };
  }
};
