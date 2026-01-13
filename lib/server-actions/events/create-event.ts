'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq, inArray, ne, sql } from 'drizzle-orm';
import {
  profiles,
  users,
  artists,
  venues,
  events,
  eventNotes,
  artistAvailabilities,
} from '@/lib/database/schema';
import { eventFormSchema, EventFormSchema } from '@/lib/validation/event-form-schema';
import { isBefore } from 'date-fns';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { recomputeConflicts } from '@/lib/data/events/recompute-conflicts';

export const createEvent = async (data: EventFormSchema): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createEvent] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      console.error('[createEvent] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = eventFormSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createEvent] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { artistId, artistManagerProfileId, venueId, availability } = validation.data;

    if (!artistId) {
      throw new AppError('Artista selezionato non valido.');
    }

    if (!venueId) {
      throw new AppError('Locale selezionato non valido.');
    }

    const { startDate, endDate } = availability;
    const now = new Date();

    if (!startDate || !endDate) {
      throw new AppError('Seleziona una data e un orario validi.');
    }

    if (isBefore(endDate, startDate)) {
      throw new AppError("L'orario di fine deve essere successivo all'orario di inizio.");
    }

    if (isBefore(startDate, now)) {
      throw new AppError('La data selezionata è già iniziata e quindi scaduta.');
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

    const rangeWindow = sql`tstzrange(${startDate}::timestamptz, ${endDate}::timestamptz, '[)')`;
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

    await database.transaction(async (tx) => {
      // STEP 1: HANDLE AVAILABILITY --------------------------------------------------------
      const [newAvailability] = await tx
        .insert(artistAvailabilities)
        .values({
          artistId: artistId,
          startDate: startDate,
          endDate: endDate,
          status: 'booked',
        })
        .returning({ id: artistAvailabilities.id });

      const availabilityId = newAvailability?.id;

      if (!availabilityId) {
        throw new AppError('Inserimento nuova disponibilità non riuscito.');
      }

      // STEP 2: HANDLE EVENT --------------------------------------------------------

      // tecnical rider has both url & name check
      const tr = validation.data.tecnicalRiderDocument;
      const validTecnicalRider = tr && tr.url.trim() !== '' && tr.name.trim() !== '';

      const [eventResult] = await tx
        .insert(events)
        .values({
          artistId: artistId,
          availabilityId: availabilityId,
          venueId: venueId,
          status: validation.data.status,

          artistManagerProfileId: artistManagerProfileId || null,
          tourManagerEmail: validation.data.tourManagerEmail || null,
          payrollConsultantEmail: validation.data.payrollConsultantEmail || null,
          moCost: validation.data.moCost?.toString() ?? null,
          venueManagerCost: validation.data.venueManagerCost?.toString() ?? null,
          depositCost: validation.data.depositCost?.toString() ?? null,
          depositInvoiceNumber: validation.data.depositInvoiceNumber || null,
          bookingPercentage: validation.data.bookingPercentage?.toString() ?? null,
          moArtistAdvancedExpenses: validation.data.moArtistAdvancedExpenses?.toString() ?? null,
          artistNetCost: validation.data.artistNetCost?.toString() ?? null,
          artistUpfrontCost: validation.data.artistUpfrontCost?.toString() ?? null,

          hotel: validation.data.hotel || null,
          hotelCost: validation.data.hotelCost?.toString() ?? null,
          restaurant: validation.data.restaurant || null,
          restaurantCost: validation.data.restaurantCost?.toString() ?? null,
          eveningContact: validation.data.eveningContact || null,
          moCoordinatorId: validation.data.moCoordinatorId || null,

          totalCost: validation.data.totalCost?.toString() ?? null,
          transportationsCost: validation.data.transportationsCost?.toString() ?? null,
          cashBalanceCost: validation.data.cashBalanceCost?.toString() ?? null,

          soundCheckStart: validation.data.soundCheckStart || null,
          soundCheckEnd: validation.data.soundCheckEnd || null,
          tecnicalRiderUrl: validTecnicalRider ? validation.data.tecnicalRiderDocument!.url : null,
          tecnicalRiderName: validTecnicalRider
            ? validation.data.tecnicalRiderDocument!.name
            : null,
          paymentDate: validation.data.paymentDate || null,

          contractSigning: validation.data.contractSigning,
          depositInvoiceIssuing: validation.data.depositInvoiceIssuing,
          depositReceiptVerification: validation.data.depositReceiptVerification,
          techSheetSubmission: validation.data.techSheetSubmission,
          artistEngagement: validation.data.artistEngagement,
          professionalsEngagement: validation.data.professionalsEngagement,
          accompanyingPersonsEngagement: validation.data.accompanyingPersonsEngagement,
          performance: validation.data.performance,
          postDateFeedback: validation.data.postDateFeedback,
          bordereau: validation.data.bordereau,
        })
        .returning({ id: events.id });

      const newEventId = eventResult?.id;
      if (!newEventId) {
        throw new AppError('Inserimento evento non riuscito.');
      }

      const writerId = user.id;

      const noteInserts = (validation.data.notes || []).map((content: string) => ({
        writerId: writerId,
        eventId: newEventId,
        content,
      }));

      if (noteInserts.length > 0) {
        await tx.insert(eventNotes).values(noteInserts);
      }

      // STEP 3: HANDLE CONFLICTS --------------------------------------------------------
      // If the new event is confirmed, reject all conflicting events first
      if (validation.data.status === 'confirmed') {
        await tx
          .update(events)
          .set({ status: 'rejected', updatedAt: now })
          .where(
            and(
              ne(events.id, newEventId),
              eq(events.artistId, artistId),
              inArray(events.status, ['proposed', 'pre-confirmed']),
              sql`${events.availabilityId} in (select id from artist_availabilities where time_range && ${rangeWindow})`,
            ),
          );
      }

      // Always recompute conflicts for this availability
      await recomputeConflicts(tx, artistId);
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[createEvent] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Creazione evento non riuscita.',
      data: null,
    };
  }
};
