'server only';

import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { artists, events, artistAvailabilities, venues, eventNotes, profiles, users, moCoordinators } from '@/lib/database/schema';
import { Event, EventNote, EventsTableFilters } from '@/lib/types';
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';

export async function getEvents({ currentPage, status, artistIds, artistManagerIds, venueIds, startDate, endDate }: EventsTableFilters): Promise<{
  data: Event[];
  totalPages: number;
  currentPage: number;
}> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;
  const isPaginated = Number.isInteger(currentPage) && (currentPage as number) > 0;
  const safePage = isPaginated ? (currentPage as number) : 1;
  const offset = (safePage - 1) * limit;

  try {
    // Build date window only if both are present: [start 00:00, end+1 00:00)
    const rangeWindow = startDate && endDate ? sql`tsrange(${startDate}::timestamp, (${endDate}::date + 1)::timestamp, '[)')` : undefined;

    // Build reusable filters
    const filters = and(
      status.length > 0 ? inArray(events.status, status) : undefined,
      artistIds.length > 0 ? inArray(events.artistId, artistIds.map(Number)) : undefined,
      artistManagerIds.length > 0 ? inArray(events.artistManagerProfileId, artistManagerIds.map(Number)) : undefined,
      venueIds.length > 0 ? inArray(events.venueId, venueIds.map(Number)) : undefined,
      rangeWindow ? sql`${artistAvailabilities.timeRange} && ${rangeWindow}` : undefined
    );

    // Base query
    let baseQuery = database
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
        previousStatus: events.previousStatus,

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
      .leftJoin(profiles, eq(events.artistManagerProfileId, profiles.id))
      .leftJoin(users, eq(profiles.userId, users.id))
      .leftJoin(moCoordinators, eq(events.moCoordinatorId, moCoordinators.id))
      .where(filters)
      .orderBy(desc(events.createdAt));

    // Apply pagination only if requested
    if (isPaginated) {
      // @ts-expect-error drizzle typing allows chaining here at runtime
      baseQuery = baseQuery.limit(limit).offset(offset);
    }

    const eventsResult = await baseQuery;

    const eventIds = eventsResult.map((e) => e.id);

    const [notesResult, [{ eventCount }]] = await Promise.all([
      eventIds.length
        ? database
            .select({
              id: eventNotes.id,
              eventId: eventNotes.eventId,
              content: eventNotes.content,
              createdAt: eventNotes.createdAt,
            })
            .from(eventNotes)
            .where(inArray(eventNotes.eventId, eventIds))
            .orderBy(eventNotes.createdAt)
        : Promise.resolve([] as Array<{ id: number; eventId: number; content: string; createdAt: Date }>),
      database.select({ eventCount: count() }).from(events).innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id)).where(filters),
    ]);

    // Group notes by eventId
    const notesByEvent: Record<number, EventNote[]> = {};
    for (const row of notesResult) {
      if (!notesByEvent[row.eventId]) notesByEvent[row.eventId] = [];
      notesByEvent[row.eventId].push({
        id: row.id,
        content: row.content,
        createdAt: row.createdAt,
      });
    }

    // Merge and nullify missing relations
    const mergedResult: Event[] = eventsResult.map((event) => {
      const newObj = {
        ...event,
        notes: notesByEvent[event.id] || [],
      } as Event;

      if (!event.artistManager?.id) newObj.artistManager = null;
      if (!event.moCoordinator?.id) newObj.moCoordinator = null;

      return newObj;
    });

    const totalPages = isPaginated ? Math.max(1, Math.ceil(Number(eventCount) / limit)) : 1;

    return {
      data: mergedResult,
      totalPages,
      currentPage: safePage,
    };
  } catch (error) {
    console.error('[getPaginatedEvents] - Error:', error);
    throw new Error('Recupero eventi non riuscito.');
  }
}
