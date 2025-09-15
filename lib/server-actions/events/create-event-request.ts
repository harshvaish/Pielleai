'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq, gt } from 'drizzle-orm';
import {
  profiles,
  users,
  artists,
  venues,
  events,
  artistAvailabilities,
} from '@/lib/database/schema';
import { eventRequestFormSchema, EventRequestFormSchema } from '@/lib/validation/event-form-schema';
import { isBefore } from 'date-fns';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';

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

    const { artistId, artistManagerProfileId, venueId, availability } = validation.data;

    let availabilityId = availability.id;
    const { startDate, endDate } = availability;
    const now = new Date();

    if (availabilityId) {
      const [availability] = await database
        .select({ count: count() })
        .from(artistAvailabilities)
        .where(
          and(
            eq(artistAvailabilities.id, availabilityId),
            eq(artistAvailabilities.artistId, artistId),
            gt(artistAvailabilities.endDate, now),
          ),
        );

      if (availability.count === 0) {
        throw new AppError('Disponibilità selezionata non trovata o scaduta.');
      }
    } else {
      if (endDate <= startDate) {
        throw new AppError("L'orario di fine deve essere successivo all'orario di inizio.");
      }

      if (isBefore(startDate, now)) {
        throw new AppError('Nuova disponibilità inserita già iniziata e quindi scaduta.');
      }
    }

    const [artistCheck, managerCheck, venueCheck] = await Promise.all([
      database.select({ count: count() }).from(artists).where(eq(artists.id, artistId)).limit(1),

      artistManagerProfileId
        ? database
            .select({ count: count() })
            .from(profiles)
            .innerJoin(users, eq(profiles.userId, users.id))
            .where(and(eq(profiles.id, artistManagerProfileId), eq(users.role, 'artist-manager')))
            .limit(1)
        : [{ count: 1 }],

      database.select({ count: count() }).from(venues).where(eq(venues.id, venueId)).limit(1),
    ]);

    if (artistCheck[0].count === 0) {
      throw new AppError('Artista selezionato non valido.');
    }

    if (managerCheck[0].count === 0) {
      throw new AppError('Manager artista selezionato non valido.');
    }

    if (venueCheck[0].count === 0) {
      throw new AppError('Locale selezionato non valido.');
    }

    await database.transaction(async (tx) => {
      if (!availabilityId) {
        const [newAvailability] = await tx
          .insert(artistAvailabilities)
          .values({
            artistId: artistId,
            startDate: startDate,
            endDate: endDate,
            status: 'available', // db trigger will book it if event confirmed
          })
          .returning({ id: artistAvailabilities.id });

        availabilityId = newAvailability?.id;

        if (!availabilityId) {
          throw new AppError('Inserimento nuova disponibilità non riuscito.');
        }
      }

      const [eventResult] = await tx
        .insert(events)
        .values({
          artistId: artistId,
          availabilityId: availabilityId,
          venueId: venueId,
          status: 'proposed',

          artistManagerProfileId: artistManagerProfileId || null,
          administrationEmail: validation.data.administrationEmail || null,
        })
        .returning({ id: events.id });

      const newEventId = eventResult?.id;
      if (!newEventId) {
        throw new AppError('Inserimento evento non riuscito.');
      }
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
