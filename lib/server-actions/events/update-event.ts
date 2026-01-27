'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq, inArray, ne, sql } from 'drizzle-orm';
import {
  profiles,
  users,
  artists,
  artistAvailabilities,
  venues,
  events,
  eventNotes,
  eventProfessionals,
} from '@/lib/database/schema';
import { eventFormSchema, EventFormSchema } from '@/lib/validation/event-form-schema';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { isBefore } from 'date-fns';
import { recomputeConflicts } from '@/lib/data/events/recompute-conflicts';
import { sendEventConfirmedEmail } from '../send-event-confirmed-email';
import { generateEventTitle } from '@/lib/utils/generate-event-title';
import {
  canActivateUpfrontPayment,
  canActivateFinalBalance,
  getNextPaymentStatus,
  calculateFinalBalanceDeadline,
  createPaymentStatusTimestamps,
  createEventStatusTimestamps,
  type PaymentStatus,
} from '@/lib/utils/payment-flow';
import { buildEventProtocolNumber } from '@/lib/utils/event-revisions';

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

    if (!artistId) {
      throw new AppError('Artista selezionato non valido.');
    }

    if (!venueId) {
      throw new AppError('Locale selezionato non valido.');
    }

    // get old event
    const [oldEvent] = await database
      .select({
        id: events.id,
        status: events.status,
        masterEventId: events.masterEventId,
        protocolNumber: events.protocolNumber,
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
    if (oldEvent.status === 'ended' && !oldEvent.masterEventId) {
      throw new AppError('Evento concluso: crea una revisione per modificarlo.');
    }

    if (!newAvailability.startDate || !newAvailability.endDate) {
      throw new AppError('Seleziona una data e un orario validi.');
    }

    if (isBefore(newAvailability.endDate, newAvailability.startDate)) {
      throw new AppError("L'orario di fine deve essere successivo all'orario di inizio.");
    }
    if (oldEvent.status !== 'ended' && isBefore(newAvailability.startDate, now)) {
      throw new AppError('Nuova disponibilità inserita già iniziata e quindi scaduta.');
    }

    if (newAvailability.id && newAvailability.id !== oldEvent.availability.id) {
      throw new AppError('Non puoi riutilizzare una disponibilità diversa per questo evento.');
    }

    const rangeWindow = sql`tstzrange(${newAvailability.startDate}::timestamptz, ${newAvailability.endDate}::timestamptz, '[)')`;
    const [[blockedCount], [overlapCount], [confirmedOverlap]] = await Promise.all([
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
            ne(events.id, eventId),
            inArray(events.status, ['proposed', 'pre-confirmed', 'confirmed']),
            sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
          ),
        ),
      database
        .select({ count: count() })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .where(
          and(
            eq(events.artistId, artistId),
            ne(events.id, eventId),
            eq(events.status, 'confirmed'),
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

    if (newStatus === 'confirmed' && confirmedOverlap.count > 0) {
      throw new AppError(
        'Un altro evento è già confermato nello stesso periodo, puoi solo rifiutare o cancellare questo evento.',
      );
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
      newAvailability.startDate,
      newAvailability.endDate,
    );

    // Tech rider integrity
    const validTecnicalRider =
      !!tecnicalRiderDocument &&
      typeof tecnicalRiderDocument.url === 'string' &&
      tecnicalRiderDocument.url.trim() !== '' &&
      typeof tecnicalRiderDocument.name === 'string' &&
      tecnicalRiderDocument.name.trim() !== '';

    // Payment flow logic
    const currentPaymentStatus = (validation.data.paymentStatus || 'pending') as PaymentStatus;
    let newPaymentStatus = currentPaymentStatus;
    const paymentStatusChanged: boolean[] = [];

    // Check if contract was just signed
    const contractJustSigned =
      (validation.data.contractSigning || validation.data.contractDocumentUrl || validation.data.contractSignedDate) &&
      canActivateUpfrontPayment(
        validation.data.contractSigning ?? false,
        validation.data.contractDocumentUrl,
        validation.data.contractSignedDate,
      );

    // Check if upfront payment was just completed
    const upfrontJustPaid =
      validation.data.upfrontPaymentDate && validation.data.upfrontPaymentAmount;

    // Check if final balance was just completed
    const balanceJustPaid =
      validation.data.finalBalanceDate && validation.data.finalBalanceAmount;

    // Update payment status based on actions
    if (contractJustSigned && currentPaymentStatus === 'pending') {
      newPaymentStatus = getNextPaymentStatus(currentPaymentStatus, 'contract-signed');
      paymentStatusChanged.push(true);
    }

    if (upfrontJustPaid && (currentPaymentStatus === 'upfront-required' || currentPaymentStatus === 'pending')) {
      newPaymentStatus = getNextPaymentStatus(currentPaymentStatus, 'upfront-paid');
      paymentStatusChanged.push(true);
      
      // Auto-calculate final balance deadline if not set
      if (!validation.data.finalBalanceDeadline) {
        const deadline = calculateFinalBalanceDeadline(newAvailability.startDate);
        validation.data.finalBalanceDeadline = deadline.toISOString();
      }
    }

    let updatedStatus = newStatus;
    if (balanceJustPaid && currentPaymentStatus === 'balance-required') {
      newPaymentStatus = getNextPaymentStatus(currentPaymentStatus, 'balance-paid');
      paymentStatusChanged.push(true);
      
      // Auto-confirm event when fully paid
      if (updatedStatus !== 'confirmed') {
        updatedStatus = 'confirmed';
      }
    }

    // Get timestamp updates for status changes
    const paymentTimestamps = paymentStatusChanged.length > 0
      ? createPaymentStatusTimestamps(newPaymentStatus)
      : {};
    
    const eventStatusChanged = updatedStatus !== oldEvent.status;
    const eventTimestamps = eventStatusChanged
      ? createEventStatusTimestamps(updatedStatus)
      : {};

    await database.transaction(async (tx) => {
      // STEP 1: HANDLE AVAILABILITY --------------------------------------------------------
      await tx
        .update(artistAvailabilities)
        .set({
          startDate: newAvailability.startDate,
          endDate: newAvailability.endDate,
          status: 'booked',
          updatedAt: now,
        })
        .where(eq(artistAvailabilities.id, oldEvent.availability.id));

      newAvailability.id = oldEvent.availability.id;

      // STEP 2: HANDLE EVENT --------------------------------------------------------
      const protocolNumber =
        updatedStatus === 'ended' && !oldEvent.protocolNumber && !oldEvent.masterEventId
          ? buildEventProtocolNumber(oldEvent.id, 0)
          : undefined;

      await tx
        .update(events)
        .set({
          title: eventTitle,
          artistId,
          availabilityId: newAvailability.id,
          venueId,

          status: updatedStatus,
          ...(protocolNumber ? { protocolNumber } : {}),

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
          artistUpfrontCost: validation.data.upfrontPayment?.toString() ?? null,

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
          paymentDate: validation.data.paymentDate || null,
          eventType: validation.data.eventType || null,

          // Payment flow fields
          paymentStatus: newPaymentStatus,
          contractSignedDate: validation.data.contractSignedDate ? new Date(validation.data.contractSignedDate) : null,
          contractDocumentUrl: validation.data.contractDocumentUrl || null,
          upfrontPaymentAmount: validation.data.upfrontPaymentAmount?.toString() ?? null,
          upfrontPaymentMethod: validation.data.upfrontPaymentMethod || null,
          upfrontPaymentDate: validation.data.upfrontPaymentDate ? new Date(validation.data.upfrontPaymentDate) : null,
          upfrontPaymentReference: validation.data.upfrontPaymentReference || null,
          upfrontPaymentNotes: validation.data.upfrontPaymentNotes || null,
          upfrontPaymentSender: validation.data.upfrontPaymentSender || null,
          upfrontPaymentStripeId: validation.data.upfrontPaymentStripeId || null,
          upfrontInvoiceUrl: validation.data.upfrontInvoiceUrl || null,
          upfrontInvoiceName: validation.data.upfrontInvoiceName || null,
          upfrontConfirmationUrl: validation.data.upfrontConfirmationUrl || null,
          upfrontConfirmationName: validation.data.upfrontConfirmationName || null,
          finalBalanceAmount: validation.data.finalBalanceAmount?.toString() ?? null,
          finalBalanceMethod: validation.data.finalBalanceMethod || null,
          finalBalanceDate: validation.data.finalBalanceDate ? new Date(validation.data.finalBalanceDate) : null,
          finalBalanceReference: validation.data.finalBalanceReference || null,
          finalBalanceNotes: validation.data.finalBalanceNotes || null,
          finalBalanceSender: validation.data.finalBalanceSender || null,
          finalBalanceStripeId: validation.data.finalBalanceStripeId || null,
          finalBalanceDeadline: validation.data.finalBalanceDeadline ? new Date(validation.data.finalBalanceDeadline) : null,
          finalInvoiceUrl: validation.data.finalInvoiceUrl || null,
          finalInvoiceName: validation.data.finalInvoiceName || null,
          finalConfirmationUrl: validation.data.finalConfirmationUrl || null,
          finalConfirmationName: validation.data.finalConfirmationName || null,

          // Timestamps for status changes
          ...paymentTimestamps,
          ...eventTimestamps,

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

      const professionalIds = validation.data.professionalIds || [];
      await tx.delete(eventProfessionals).where(eq(eventProfessionals.eventId, eventId));
      if (professionalIds.length) {
        await tx.insert(eventProfessionals).values(
          professionalIds.map((professionalId) => ({
            eventId,
            professionalId,
          })),
        );
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
              inArray(events.status, ['proposed', 'pre-confirmed']),
              eq(events.artistId, artistId),
              sql`${events.availabilityId} in (select id from artist_availabilities where time_range && ${rangeWindow})`,
            ),
          );
      }

      // Recompute conflicts for the new availability
      await recomputeConflicts(tx, artistId);
    });

    // STEP 4: SEND EMAIL NOTIFICATION IF STATUS CHANGED TO CONFIRMED ----------------
    if (newStatus === 'confirmed' && oldEvent.status !== 'confirmed') {
      const artistName =
        oldEvent.artist.stageName || `${oldEvent.artist.name} ${oldEvent.artist.surname}`.trim();

      // Send email notification asynchronously (don't block the response)
      sendEventConfirmedEmail({
        eventId: oldEvent.id,
        artistName,
        venueName: oldEvent.venue.name,
        venueAddress: oldEvent.venue.address || 'Non specificato',
        startDate: newAvailability.startDate,
        endDate: newAvailability.endDate,
      }).catch((error) => {
        // Log error but don't fail the entire operation
        console.error('[updateEvent] - Failed to send notification email:', error);
      });
    }

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
