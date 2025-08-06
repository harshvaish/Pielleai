'server only';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { artists, events, artistAvailabilities, venues, eventNotes, profiles, users, moCoordinators } from '@/lib/database/schema';
import { Event, EventNote } from '@/lib/types';
import { count, desc, eq, inArray } from 'drizzle-orm';

export async function getPaginatedEvents({ currentPage }: { currentPage: number }): Promise<{
  data: Event[];
  totalPages: number;
  currentPage: number;
}> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;
  const offset = (currentPage - 1) * limit;

  try {
    // Get paginated events
    const eventsResult = await database
      .select({
        id: events.id,

        artist: {
          id: artists.id,
          status: artists.status,
          slug: artists.slug,
          avatarUrl: artists.avatarUrl,
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
        },
        availability: {
          id: artistAvailabilities.id,
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
          status: artistAvailabilities.status,
        },
        venue: {
          id: venues.id,
          status: venues.status,
          slug: venues.slug,
          avatarUrl: venues.avatarUrl,
          name: venues.name,
        },
        status: events.status,

        artistManager: {
          id: users.id,
          status: users.status,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
        },

        tourManagerName: artists.tourManagerName,
        tourManagerSurname: artists.tourManagerSurname,

        administrationEmail: events.administrationEmail,
        payrollConsultantEmail: events.payrollConsultantEmail,

        moCost: events.moCost,
        venueManagerCost: events.venueManagerCost,
        depositCost: events.depositCost,
        depositInvoiceNumber: events.depositInvoiceNumber,
        expenseReimbursement: events.expenseReimbursement,
        bookingPercentage: events.bookingPercentage,
        supplierCost: events.supplierCost,
        moArtistAdvancedExpenses: events.moArtistAdvancedExpenses,
        artistNetCost: events.artistNetCost,
        artistUpfrontCost: events.artistUpfrontCost,

        hotel: events.hotel,
        restaurant: events.restaurant,
        eveningContact: events.eveningContact,

        moCoordinator: {
          id: moCoordinators.id,
          name: moCoordinators.name,
          surname: moCoordinators.surname,
        },

        totalCost: events.totalCost,
        transportationsCost: events.transportationsCost,
        cashBalanceCost: events.cashBalanceCost,

        soundCheckStart: events.soundCheckStart,
        soundCheckEnd: events.soundCheckEnd,

        tecnicalRiderUrl: events.tecnicalRiderUrl,
        tecnicalRiderName: events.tecnicalRiderName,

        contractSigning: events.contractSigning,
        depositInvoiceIssuing: events.depositInvoiceIssuing,
        depositReceiptVerification: events.depositReceiptVerification,
        techSheetSubmission: events.techSheetSubmission,
        artistEngagement: events.artistEngagement,
        professionalsEngagement: events.professionalsEngagement,
        accompanyingPersonsEngagement: events.accompanyingPersonsEngagement,

        performance: events.performance,

        postDateFeedback: events.postDateFeedback,
        bordereau: events.bordereau,
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .innerJoin(artists, eq(events.artistId, artists.id))
      .innerJoin(profiles, eq(events.artistManagerProfileId, profiles.id))
      .innerJoin(users, eq(profiles.userId, users.id))
      .leftJoin(moCoordinators, eq(events.moCoordinatorId, moCoordinators.id))
      .orderBy(desc(events.createdAt))
      .limit(limit)
      .offset(offset);

    const eventIds = eventsResult.map((e) => e.id);

    const [notesResult, [{ eventCount }]] = await Promise.all([
      database
        .select({
          id: eventNotes.id,
          eventId: eventNotes.eventId,
          content: eventNotes.content,
          createdAt: eventNotes.createdAt,
        })
        .from(eventNotes)
        .where(inArray(eventNotes.eventId, eventIds))
        .orderBy(eventNotes.createdAt),

      database.select({ eventCount: count() }).from(events),
    ]);

    // Group notes by eventId
    const notesByEvent: Record<number, EventNote[]> = {};

    for (const row of notesResult) {
      if (!notesByEvent[row.eventId]) {
        notesByEvent[row.eventId] = [];
      }
      notesByEvent[row.eventId].push({
        id: row.id,
        content: row.content,
        createdAt: row.createdAt,
      });
    }

    // Merge artist + managers + zones
    const mergedResult = eventsResult.map((event) => ({
      ...event,
      notes: notesByEvent[event.id] || [],
    }));

    const totalPages = Math.ceil(Number(eventCount) / limit);

    return {
      data: mergedResult,
      totalPages,
      currentPage,
    };
  } catch (error) {
    console.error('[getPaginatedEvents] - Error:', error);
    throw new Error('Recupero eventi non riuscito.');
  }
}
