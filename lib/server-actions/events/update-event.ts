'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq, gt, ne } from 'drizzle-orm';
import { profiles, users, artists, artistAvailabilities, venues, events, eventNotes } from '@/lib/database/schema';
import { eventFormSchema, EventFormSchema } from '@/lib/validation/eventFormSchema';
import { parse } from 'date-fns';
import { AppError } from '@/lib/classes/AppError';
import { TIME_ZONE } from '@/lib/constants';
import { fromZonedTime } from 'date-fns-tz';

export const updateEvent = async (eventId: number, data: EventFormSchema): Promise<ServerActionResponse<null>> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    const parsed = eventFormSchema.safeParse(data);
    if (!parsed.success) throw new AppError('I dati inviati non sono corretti.');

    const { artistId, artistManagerProfileId, venueId, availability, status: desiredStatus, tecnicalRiderDocument } = parsed.data;

    // 1) Load current event (to know current availability/status)
    const [currentEvent] = await database
      .select({
        id: events.id,
        status: events.status,
        availabilityId: events.availabilityId,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);
    if (!currentEvent) throw new AppError('Evento non trovato.');

    // 2) Validate foreign keys exist
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

    // 3) Availability resolution
    let targetAvailabilityId = availability.id as number | undefined;
    let startDateUTC: Date | undefined;
    let endDateUTC: Date | undefined;
    const nowUTC = new Date();

    if (!targetAvailabilityId) {
      // Create-from date/time (Europe/Rome → UTC)
      const parsedStart = parse(`${availability.date} ${availability.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
      const parsedEnd = parse(`${availability.date} ${availability.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
      startDateUTC = fromZonedTime(parsedStart, TIME_ZONE);
      endDateUTC = fromZonedTime(parsedEnd, TIME_ZONE);

      if (endDateUTC <= startDateUTC) throw new AppError("L'orario di fine deve essere successivo all'orario di inizio.");
      if (startDateUTC <= nowUTC) throw new AppError('Nuova disponibilità inserita già iniziata e quindi scaduta.');
    } else {
      // Reuse existing availability: must belong to artist and not be expired
      const [availabilityCheck] = await database
        .select({ count: count() })
        .from(artistAvailabilities)
        .where(and(eq(artistAvailabilities.id, targetAvailabilityId), eq(artistAvailabilities.artistId, artistId), gt(artistAvailabilities.endDate, nowUTC)))
        .limit(1);
      if (availabilityCheck.count === 0) throw new AppError('Disponibilità selezionata non trovata o scaduta.');
    }

    // 4) Tech rider integrity
    const validTecnicalRider =
      !!tecnicalRiderDocument &&
      typeof tecnicalRiderDocument.url === 'string' &&
      tecnicalRiderDocument.url.trim() !== '' &&
      typeof tecnicalRiderDocument.name === 'string' &&
      tecnicalRiderDocument.name.trim() !== '';

    await database.transaction(async (tx) => {
      // 5) Create availability if needed
      if (!targetAvailabilityId && startDateUTC && endDateUTC) {
        const [newAvail] = await tx
          .insert(artistAvailabilities)
          .values({
            artistId,
            startDate: startDateUTC,
            endDate: endDateUTC,
            status: 'available', // triggers will flip to 'booked' if we confirm
          })
          .returning({ id: artistAvailabilities.id });
        if (!newAvail?.id) throw new AppError('Inserimento nuova disponibilità non riuscito.');
        targetAvailabilityId = newAvail.id;
      }

      // 6) Fetch target availability row to consult its current status
      const [targetAvail] = await tx
        .select({ status: artistAvailabilities.status, endDate: artistAvailabilities.endDate })
        .from(artistAvailabilities)
        .where(eq(artistAvailabilities.id, targetAvailabilityId!))
        .limit(1);
      if (!targetAvail) throw new AppError('Disponibilità selezionata non trovata.');

      // 5c) Pre-checks for the final status we’re going to set
      if (desiredStatus === 'conflict') {
        throw new AppError("Lo stato 'conflitto' è gestito automaticamente dal sistema.");
      }

      if (desiredStatus === 'confirmed') {
        // UX pre-check (unique partial index will enforce anyway)
        const [already] = await tx
          .select({ count: count() })
          .from(events)
          .where(and(eq(events.availabilityId, targetAvailabilityId!), eq(events.status, 'confirmed'), ne(events.id, eventId)))
          .limit(1);
        if (already.count > 0) {
          throw new AppError('Un altro evento è già confermato per questa disponibilità.');
        }
      }

      // prevent activating a non-confirmed event on a booked availability
      if (['proposed', 'pre-confirmed'].includes(desiredStatus) && targetAvail.status === 'booked') {
        throw new AppError('Questa disponibilità è già prenotata da un evento confermato.');
      }

      // 5d) update the event
      await tx
        .update(events)
        .set({
          artistId,
          availabilityId: targetAvailabilityId!,
          venueId,

          status: desiredStatus, // triggers handle conflicts/booking

          artistManagerProfileId: artistManagerProfileId || null,
          administrationEmail: parsed.data.administrationEmail || null,
          payrollConsultantEmail: parsed.data.payrollConsultantEmail || null,

          moCost: parsed.data.moCost?.toString() ?? null,
          venueManagerCost: parsed.data.venueManagerCost?.toString() ?? null,
          depositCost: parsed.data.depositCost?.toString() ?? null,
          depositInvoiceNumber: parsed.data.depositInvoiceNumber || null,
          expenseReimbursement: parsed.data.expenseReimbursement?.toString() ?? null,
          bookingPercentage: parsed.data.bookingPercentage?.toString() ?? null,
          supplierCost: parsed.data.supplierCost?.toString() ?? null,
          moArtistAdvancedExpenses: parsed.data.moArtistAdvancedExpenses?.toString() ?? null,
          artistNetCost: parsed.data.artistNetCost?.toString() ?? null,
          artistUpfrontCost: parsed.data.artistUpfrontCost?.toString() ?? null,

          hotel: parsed.data.hotel || null,
          restaurant: parsed.data.restaurant || null,
          eveningContact: parsed.data.eveningContact || null,
          moCoordinatorId: parsed.data.moCoordinatorId || null,

          totalCost: parsed.data.totalCost?.toString() ?? null,
          transportationsCost: parsed.data.transportationsCost?.toString() ?? null,
          cashBalanceCost: parsed.data.cashBalanceCost?.toString() ?? null,

          soundCheckStart: parsed.data.soundCheckStart || null,
          soundCheckEnd: parsed.data.soundCheckEnd || null,

          tecnicalRiderUrl: validTecnicalRider ? tecnicalRiderDocument!.url : null,
          tecnicalRiderName: validTecnicalRider ? tecnicalRiderDocument!.name : null,

          contractSigning: parsed.data.contractSigning,
          depositInvoiceIssuing: parsed.data.depositInvoiceIssuing,
          depositReceiptVerification: parsed.data.depositReceiptVerification,
          techSheetSubmission: parsed.data.techSheetSubmission,
          artistEngagement: parsed.data.artistEngagement,
          professionalsEngagement: parsed.data.professionalsEngagement,
          accompanyingPersonsEngagement: parsed.data.accompanyingPersonsEngagement,
          performance: parsed.data.performance,
          postDateFeedback: parsed.data.postDateFeedback,
          bordereau: parsed.data.bordereau,

          updatedAt: nowUTC,
        })
        .where(eq(events.id, eventId));

      // 5e) replace notes
      await tx.delete(eventNotes).where(eq(eventNotes.eventId, eventId));
      const notes = (parsed.data.notes || [])
        .map((content: string) => content.trim())
        .filter(Boolean)
        .map((content: string) => ({
          writerId: session.user.id,
          eventId,
          content,
        }));
      if (notes.length) {
        await tx.insert(eventNotes).values(notes);
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
