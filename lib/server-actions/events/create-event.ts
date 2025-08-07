'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq, gt } from 'drizzle-orm';
import { profiles, users, artists, artistAvailabilities, venues, events, eventNotes } from '@/lib/database/schema';
import { eventFormSchema, EventFormSchema } from '@/lib/validation/eventFormSchema';
import { isBefore, parse } from 'date-fns';
import { AppError } from '@/lib/classes/AppError';
import { TIME_ZONE } from '@/lib/constants';
import { fromZonedTime } from 'date-fns-tz';

export const createEvent = async (data: EventFormSchema): Promise<ServerActionResponse<null>> => {
  try {
    const headersList = await headers();
    let writerId = undefined;

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[createEvent] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    writerId = session.user.id;

    const validation = eventFormSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createEvent] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { artistId, artistManagerProfileId, venueId, availability } = validation.data;

    let availabilityId = availability.id;

    if (availabilityId) {
      const availabilityCheck = await database
        .select({ count: count() })
        .from(artistAvailabilities)
        .where(and(eq(artistAvailabilities.id, availabilityId), gt(artistAvailabilities.endDate, new Date())));

      if (availabilityCheck[0].count === 0) {
        throw new AppError('Disponibilità selezionata non trovata o scaduta.');
      }
    } else {
      const availabilityStartDate = parse(`${availability.date} ${availability.startTime}`, 'yyyy-MM-dd HH:mm', new Date());

      if (isBefore(availabilityStartDate, new Date())) {
        throw new AppError('Nuova disponibilità inserita scaduta.');
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
      if (availabilityId && validation.data.status === 'confirmed') {
        const existingConfirmed = await tx
          .select({ count: count() })
          .from(events)
          .where(and(eq(events.availabilityId, availabilityId), eq(events.status, 'confirmed')))
          .limit(1);

        if (existingConfirmed[0].count > 0) {
          throw new AppError('Esiste già un evento confermato per questa disponibilità.');
        }
      }

      if (!availabilityId) {
        const { date, startTime, endTime } = availability;

        // Step 1: Parse as naive date (no timezone interpretation yet)
        const parsedStart = parse(`${date} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
        const parsedEnd = parse(`${date} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());

        // Step 2: Interpret as Europe/Rome and convert to UTC
        const startDate = fromZonedTime(parsedStart, TIME_ZONE);
        const endDate = fromZonedTime(parsedEnd, TIME_ZONE);

        const [newAvailability] = await tx
          .insert(artistAvailabilities)
          .values({
            artistId: artistId,
            startDate: startDate,
            endDate: endDate,
            status: validation.data.status === 'confirmed' ? 'booked' : 'available',
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
          status: validation.data.status,

          artistManagerProfileId: artistManagerProfileId || null,
          administrationEmail: validation.data.administrationEmail || null,
          payrollConsultantEmail: validation.data.payrollConsultantEmail || null,
          moCost: validation.data.moCost?.toString() ?? null,
          venueManagerCost: validation.data.venueManagerCost?.toString() ?? null,
          depositCost: validation.data.depositCost?.toString() ?? null,
          depositInvoiceNumber: validation.data.depositInvoiceNumber || null,
          expenseReimbursement: validation.data.expenseReimbursement?.toString() ?? null,
          bookingPercentage: validation.data.bookingPercentage?.toString() ?? null,
          supplierCost: validation.data.supplierCost?.toString() ?? null,
          moArtistAdvancedExpenses: validation.data.moArtistAdvancedExpenses?.toString() ?? null,
          artistNetCost: validation.data.artistNetCost?.toString() ?? null,
          artistUpfrontCost: validation.data.artistUpfrontCost?.toString() ?? null,

          hotel: validation.data.hotel || null,
          restaurant: validation.data.restaurant || null,
          eveningContact: validation.data.eveningContact || null,
          moCoordinatorId: validation.data.moCoordinatorId || null,

          totalCost: validation.data.totalCost?.toString() ?? null,
          transportationsCost: validation.data.transportationsCost?.toString() ?? null,
          cashBalanceCost: validation.data.cashBalanceCost?.toString() ?? null,

          soundCheckStart: validation.data.soundCheckStart || null,
          soundCheckEnd: validation.data.soundCheckEnd || null,
          tecnicalRiderUrl: validation.data.tecnicalRiderDocument ? validation.data.tecnicalRiderDocument.url : null,
          tecnicalRiderName: validation.data.tecnicalRiderDocument ? validation.data.tecnicalRiderDocument.name : null,

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

      const noteInserts = (validation.data.notes || []).map((content: string) => ({
        writerId: writerId,
        eventId: newEventId,
        content,
      }));

      if (noteInserts.length > 0) {
        await tx.insert(eventNotes).values(noteInserts);
      }
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
