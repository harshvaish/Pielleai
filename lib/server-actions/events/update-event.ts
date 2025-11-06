'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq, inArray, ne } from 'drizzle-orm';
import {
  profiles,
  users,
  artists,
  artistAvailabilities,
  venues,
  events,
  eventNotes,
} from '@/lib/database/schema';
import { eventFormSchema, EventFormSchema } from '@/lib/validation/event-form-schema';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { isBefore } from 'date-fns';
import { recomputeConflicts } from '@/lib/data/events/recompute-conflicts';

export const updateEvent = async (
  eventId: number,
  data: EventFormSchema,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateEvent] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      console.error('[updateEvent] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = eventFormSchema.safeParse(data);
    if (!validation.success) throw new AppError('I dati inviati non sono corretti.');

    const {
      artistId,
      artistManagerProfileId,
      venueId,
      availability: newAvailability,
      status: newStatus,
      tecnicalRiderDocument,
    } = validation.data;
    const now = new Date();

    // get old event
    const [oldEvent] = await database
      .select({
        id: events.id,
        status: events.status,
        availability: {
          id: artistAvailabilities.id,
          status: artistAvailabilities.status,
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
        },
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .where(eq(events.id, eventId))
      .limit(1);

    if (!oldEvent) throw new AppError('Evento non trovato.');

    if (['rejected', 'ended'].includes(oldEvent.status)) {
      throw new AppError('Evento rifiutato o terminato, non puoi modificarlo.');
    }

    if (isBefore(newAvailability.endDate, newAvailability.startDate)) {
      throw new AppError("L'orario di fine deve essere successivo all'orario di inizio.");
    }
    if (isBefore(newAvailability.startDate, now)) {
      throw new AppError('Nuova disponibilità inserita già iniziata e quindi scaduta.');
    }

    if (newAvailability.id) {
      // if the availability is different from the old one, we need to check it exists and is available
      if (newAvailability.id != oldEvent.availability.id) {
        const [availabilityCheck] = await database
          .select({
            id: artistAvailabilities.id,
            status: artistAvailabilities.status,
            startDate: artistAvailabilities.startDate,
            endDate: artistAvailabilities.endDate,
          })
          .from(artistAvailabilities)
          .where(
            and(
              eq(artistAvailabilities.id, newAvailability.id),
              eq(artistAvailabilities.artistId, artistId),
            ),
          )
          .limit(1);

        if (availabilityCheck.status != 'available') {
          throw new AppError('Disponibilità selezionata già prenotata o scaduta.');
        }

        if (isBefore(availabilityCheck.startDate, now)) {
          throw new AppError('Disponibilità selezionata già iniziata e quindi scaduta.');
        }

        if (isBefore(availabilityCheck.endDate, now)) {
          throw new AppError('Disponibilità selezionata scaduta.');
        }
      }

      if (newStatus !== oldEvent.status) {
        if (['proposed', 'pre-confirmed', 'confirmed'].includes(newStatus)) {
          const [already] = await database
            .select({ count: count() })
            .from(events)
            .where(
              and(
                ne(events.id, eventId),
                eq(events.availabilityId, newAvailability.id),
                eq(events.status, 'confirmed'),
              ),
            )
            .limit(1);

          if (already.count > 0) {
            throw new AppError(
              'Un altro evento è già confermato per questa disponibilità, puoi solo rifiutare o cancellare questo evento.',
            );
          }
        }
      }
    }

    // Validate foreign keys exist
    const [[artistCheck], [managerCheck], [venueCheck]] = await Promise.all([
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

    if (artistCheck.count === 0) throw new AppError('Artista selezionato non valido.');
    if (managerCheck.count === 0) throw new AppError('Manager artista selezionato non valido.');
    if (venueCheck.count === 0) throw new AppError('Locale selezionato non valido.');

    // Tech rider integrity
    const validTecnicalRider =
      !!tecnicalRiderDocument &&
      typeof tecnicalRiderDocument.url === 'string' &&
      tecnicalRiderDocument.url.trim() !== '' &&
      typeof tecnicalRiderDocument.name === 'string' &&
      tecnicalRiderDocument.name.trim() !== '';

    await database.transaction(async (tx) => {
      // STEP 1: HANDLE AVAILABILITY --------------------------------------------------------
      if (newAvailability.id) {
        await tx
          .update(artistAvailabilities)
          .set({ status: newStatus === 'confirmed' ? 'booked' : 'available', updatedAt: now })
          .where(eq(artistAvailabilities.id, newAvailability.id));
      } else {
        const [newAvail] = await tx
          .insert(artistAvailabilities)
          .values({
            artistId,
            startDate: newAvailability.startDate,
            endDate: newAvailability.endDate,
            status: newStatus === 'confirmed' ? 'booked' : 'available',
          })
          .returning({ id: artistAvailabilities.id });

        if (!newAvail?.id) throw new AppError('Inserimento nuova disponibilità non riuscito.');
        newAvailability.id = newAvail.id;
      }

      // STEP 2: HANDLE EVENT --------------------------------------------------------
      await tx
        .update(events)
        .set({
          artistId,
          availabilityId: newAvailability.id,
          venueId,

          status: newStatus,

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

          tecnicalRiderUrl: validTecnicalRider ? tecnicalRiderDocument!.url : null,
          tecnicalRiderName: validTecnicalRider ? tecnicalRiderDocument!.name : null,

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

          updatedAt: now,
        })
        .where(eq(events.id, eventId));

      // replace notes
      await tx.delete(eventNotes).where(eq(eventNotes.eventId, eventId));
      const notes = (validation.data.notes || [])
        .map((content: string) => content.trim())
        .filter(Boolean)
        .map((content: string) => ({
          writerId: user.id,
          eventId,
          content,
        }));
      if (notes.length) {
        await tx.insert(eventNotes).values(notes);
      }

      // STEP 3: HANDLE CONFLICTS --------------------------------------------------------
      // If status changed to confirmed, reject conflicts
      if (newStatus === 'confirmed') {
        await tx
          .update(events)
          .set({ status: 'rejected', updatedAt: now })
          .where(
            and(
              ne(events.id, eventId),
              eq(events.availabilityId, newAvailability.id),
              inArray(events.status, ['proposed', 'pre-confirmed']),
            ),
          );
      }

      // Recompute conflicts for the new availability
      await recomputeConflicts(tx, newAvailability.id);

      // If availability changed, also recompute for the old availability
      if (newAvailability.id !== oldEvent.availability.id) {
        await recomputeConflicts(tx, oldEvent.availability.id);
      }
    });

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[updateEvent] error:', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento evento non riuscito.',
      data: null,
    };
  }
};
