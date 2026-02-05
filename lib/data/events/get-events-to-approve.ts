'server only';

import { database } from '@/lib/database/connection';
import {
  artists,
  events,
  artistAvailabilities,
  venues,
  profiles,
  users,
  moCoordinators,
  eventNotes,
} from '@/lib/database/schema';
import { Event, EventNote } from '@/lib/types';
import { and, eq, inArray } from 'drizzle-orm';
import { latestRevisionFilter } from './revision-helpers';

export async function getEventsToApprove(): Promise<{ data: Event[] }> {
  try {
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
          address: venues.address,
          city: venues.city,
          zipCode: venues.zipCode,
        },

        status: events.status,
        masterEventId: events.masterEventId,
        revisionNumber: events.revisionNumber,
        protocolNumber: events.protocolNumber,
        revisionReason: events.revisionReason,
        revisionDescription: events.revisionDescription,
        revisionCreatedByUserId: events.revisionCreatedByUserId,
        revisionCreatedAt: events.revisionCreatedAt,
        hasConflict: events.hasConflict,

        artistManager: {
          id: users.id,
          status: users.status,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
        },

        tourManagerEmail: events.tourManagerEmail,

        payrollConsultantEmail: events.payrollConsultantEmail,

        moCost: events.moCost,
        venueManagerCost: events.venueManagerCost,
        depositCost: events.depositCost,
        depositInvoiceNumber: events.depositInvoiceNumber,
        bookingPercentage: events.bookingPercentage,
        moArtistAdvancedExpenses: events.moArtistAdvancedExpenses,
        artistNetCost: events.artistNetCost,
        artistUpfrontCost: events.artistUpfrontCost,

        hotel: events.hotel,
        hotelCost: events.hotelCost,
        restaurant: events.restaurant,
        restaurantCost: events.restaurantCost,
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
      .where(and(latestRevisionFilter, eq(events.status, 'proposed')))
      .orderBy(artistAvailabilities.startDate);

    const eventIds = eventsResult.map((e) => e.id);
    const notesByEvent: Record<number, EventNote[]> = {};

    if (eventIds.length > 0) {
      const notesResult = await database
        .select({
          id: eventNotes.id,
          eventId: eventNotes.eventId,
          content: eventNotes.content,
          createdAt: eventNotes.createdAt,
        })
        .from(eventNotes)
        .where(inArray(eventNotes.eventId, eventIds))
        .orderBy(eventNotes.createdAt);

      // Group notes by eventId
      for (const row of notesResult) {
        if (!notesByEvent[row.eventId]) notesByEvent[row.eventId] = [];
        notesByEvent[row.eventId].push({
          id: row.id,
          content: row.content,
          createdAt: row.createdAt,
        });
      }
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

    return {
      data: mergedResult,
    };
  } catch (error) {
    console.error('[getPaginatedEvents] - Error:', error);
    throw new Error('Recupero eventi non riuscito.');
  }
}
