'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq } from 'drizzle-orm';
import {
  profiles,
  users,
  artists,
  artistAvailabilities,
  venues,
  events,
  eventNotes,
} from '@/lib/database/schema';
import {
  eventFormSchema,
  EventFormSchema,
} from '@/lib/validation/eventFormSchema';
import { isBefore, parse } from 'date-fns';

export const createEvent = async (
  data: EventFormSchema
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  let writerId = undefined;

  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[createEvent] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }

    writerId = session.user.id;
  } catch (error) {
    console.error('[createEvent] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = eventFormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[createEvent] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const { artistId, artistManagerProfileId, venueId, availability } =
    validation.data;

  const combined = `${availability.date} ${availability.startTime}`;
  const availabilityStartDate = parse(combined, 'yyyy-MM-dd HH:mm', new Date());

  if (isBefore(availabilityStartDate, new Date())) {
    return {
      success: false,
      message: 'Disponibilità scaduta.',
      data: null,
    };
  }

  let availabilityId = parseInt(availability.id || '');

  if (availabilityId) {
    const availabilityCheck = await database
      .select({ count: count() })
      .from(artistAvailabilities)
      .where(
        and(
          eq(artistAvailabilities.id, availabilityId),
          eq(artistAvailabilities.status, 'available')
        )
      )
      .limit(1);

    if (availabilityCheck[0].count === 0) {
      return {
        success: false,
        message: 'Disponibilità selezionata non valida.',
        data: null,
      };
    }
  } else {
    try {
      const newAvailability = await database
        .insert(artistAvailabilities)
        .values({
          artistId: artistId,
          startDate: new Date(`${availability.date} ${availability.startTime}`),
          endDate: new Date(`${availability.date} ${availability.endTime}`),
          status: 'available',
        })
        .returning({ id: artistAvailabilities.id });

      availabilityId = newAvailability[0]?.id;
    } catch {
      return {
        success: false,
        message: 'Inserimento disponibilità non riuscito.',
        data: null,
      };
    }
  }

  try {
    const [artistCheck, managerCheck, venueCheck] = await Promise.all([
      database
        .select({ count: count() })
        .from(artists)
        .where(eq(artists.id, artistId))
        .limit(1),

      artistManagerProfileId
        ? database
            .select({ count: count() })
            .from(profiles)
            .innerJoin(users, eq(profiles.userId, users.id))
            .where(
              and(
                eq(profiles.id, artistManagerProfileId),
                eq(users.role, 'artist-manager')
              )
            )
            .limit(1)
        : [{ count: 1 }],

      database
        .select({ count: count() })
        .from(venues)
        .where(eq(venues.id, venueId))
        .limit(1),
    ]);

    if (artistCheck[0].count === 0) {
      return {
        success: false,
        message: 'Artista selezionato non valido.',
        data: null,
      };
    }

    if (managerCheck[0].count === 0) {
      return {
        success: false,
        message: 'Manager artista selezionato non valido.',
        data: null,
      };
    }

    if (venueCheck[0].count === 0) {
      return {
        success: false,
        message: 'Locale selezionato non valido.',
        data: null,
      };
    }

    await database.transaction(async (tx) => {
      const eventResult = await tx
        .insert(events)
        .values({
          artistId: artistId,
          availabilityId: availabilityId,
          venueId: venueId,
          status: validation.data.status,

          artistManagerProfileId: artistManagerProfileId || null,

          administrationEmail: validation.data.administrationEmail || null,

          payrollConsultantEmail:
            validation.data.payrollConsultantEmail || null,

          moCost: validation.data.moCost?.toString() ?? null,

          venueManagerCost:
            validation.data.venueManagerCost?.toString() ?? null,

          depositCost: validation.data.depositCost?.toString() ?? null,

          depositInvoiceNumber: validation.data.depositInvoiceNumber || null,

          expenseReimbursement:
            validation.data.expenseReimbursement?.toString() ?? null,

          bookingPercentage:
            validation.data.bookingPercentage?.toString() ?? null,

          supplierCost: validation.data.supplierCost?.toString() ?? null,

          moArtistAdvancedExpenses:
            validation.data.moArtistAdvancedExpenses?.toString() ?? null,

          artistNetCost: validation.data.artistNetCost?.toString() ?? null,

          artistUpfrontCost:
            validation.data.artistUpfrontCost?.toString() ?? null,

          hotel: validation.data.hotel || null,
          restaurant: validation.data.restaurant || null,
          eveningContact: validation.data.eveningContact || null,
          moCoordinatorId: validation.data.moCoordinatorId || null,

          totalCost: validation.data.totalCost?.toString() ?? null,

          transportationsCost:
            validation.data.transportationsCost?.toString() ?? null,

          cashBalanceCost: validation.data.cashBalanceCost?.toString() ?? null,

          soundCheckStart: validation.data.soundCheckStart || null,
          soundCheckEnd: validation.data.soundCheckEnd || null,
          tecnicalRiderUrl: validation.data.tecnicalRiderDocument
            ? validation.data.tecnicalRiderDocument.url
            : null,
          tecnicalRiderName: validation.data.tecnicalRiderDocument
            ? validation.data.tecnicalRiderDocument.name
            : null,

          contractSigning: validation.data.contractSigning,
          depositInvoiceIssuing: validation.data.depositInvoiceIssuing,
          depositReceiptVerification:
            validation.data.depositReceiptVerification,
          techSheetSubmission: validation.data.techSheetSubmission,
          artistEngagement: validation.data.artistEngagement,
          professionalsEngagement: validation.data.professionalsEngagement,
          accompanyingPersonsEngagement:
            validation.data.accompanyingPersonsEngagement,

          performance: validation.data.performance,

          postDateFeedback: validation.data.postDateFeedback,
          bordereau: validation.data.bordereau,
        })
        .returning({ id: events.id });

      const newEventId = eventResult[0]?.id;
      if (!newEventId) {
        return {
          success: false,
          message: 'Recupero id evento non riuscito.',
          data: null,
        };
      }

      if (
        validation.data.status == 'proposed' ||
        validation.data.status == 'pre-confirmed'
      ) {
        await tx
          .update(artistAvailabilities)
          .set({
            status: 'booked',
            updatedAt: new Date(),
          })
          .where(eq(artistAvailabilities.id, availabilityId));
      }

      const noteInserts = (validation.data.notes || []).map(
        (content: string) => ({
          writerId: writerId,
          eventId: newEventId,
          content,
        })
      );

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
    console.error('[createEvent] transaction failed', error);
    return {
      success: false,
      message: 'Creazione evento non riuscita.',
      data: null,
    };
  }
};
