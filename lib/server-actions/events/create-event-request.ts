'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq } from 'drizzle-orm';
import { artists, venues, events, artistAvailabilities } from '@/lib/database/schema';
import { eventRequestFormSchema, EventRequestFormSchema } from '@/lib/validation/event-form-schema';
import { isBefore } from 'date-fns';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { recomputeConflicts } from '@/lib/data/events/recompute-conflicts';

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

    const [[availabilityCheck], [artistCheck], [venueCheck]] = await Promise.all([
      database
        .select({
          id: artistAvailabilities.id,
          status: artistAvailabilities.status,
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
        })
        .from(artistAvailabilities)
        .where(
          and(
            eq(artistAvailabilities.id, availability.id),
            eq(artistAvailabilities.artistId, artistId),
          ),
        )
        .limit(1),
      database.select({ count: count() }).from(artists).where(eq(artists.id, artistId)).limit(1),
      database.select({ count: count() }).from(venues).where(eq(venues.id, venueId)).limit(1),
    ]);

    if (availabilityCheck.status != 'available') {
      throw new AppError('Disponibilità selezionata già prenotata o scaduta.');
    }

    if (isBefore(availabilityCheck.startDate, now)) {
      throw new AppError('Disponibilità selezionata già iniziata e quindi scaduta.');
    }

    if (isBefore(availabilityCheck.endDate, now)) {
      throw new AppError('Disponibilità selezionata scaduta.');
    }

    if (artistCheck.count === 0) {
      throw new AppError('Artista selezionato non valido.');
    }

    if (venueCheck.count === 0) {
      throw new AppError('Locale selezionato non valido.');
    }

    await database.transaction(async (tx) => {
      const [eventResult] = await tx
        .insert(events)
        .values({
          artistId: artistId,
          availabilityId: availability.id,
          venueId: venueId,
          status: 'proposed',
        })
        .returning({ id: events.id });

      const newEventId = eventResult?.id;

      if (!newEventId) {
        throw new AppError('Inserimento evento non riuscito.');
      }

      // HANDLE CONFLICTS --------------------------------------------------------
      await recomputeConflicts(tx, availability.id);
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
