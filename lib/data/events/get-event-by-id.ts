'server only';

import { User } from '@/lib/auth';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { database } from '@/lib/database/connection';
import { alias } from 'drizzle-orm/pg-core';
import {
  artists,
  events,
  artistAvailabilities,
  venues,
  eventNotes,
  eventProfessionals,
  eventGuests,
  profiles,
  users,
  moCoordinators,
} from '@/lib/database/schema';
import { Event, EventAccreditationGuest, EventNote } from '@/lib/types';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { contracts, contractEmailCcs, contractHistory } from '../../../drizzle/schema';

const venueManagerProfile = alias(profiles, 'venueManagerProfile');
const venueManagerUser = alias(users, 'venueManagerUser');

export async function getEventById(user: User, eventId: number): Promise<Event | null> {
  const isAdmin = user.role === 'admin';
  const isArtistManager = user.role === 'artist-manager';
  const isVenueManager = user.role === 'venue-manager';

  let profileId: number | null = null;
  if (!isAdmin) {
    profileId = await getUserProfileIdCached(user.id);
    if (!profileId) throw new Error('Recupero profilo non riuscito.');
  }

  const filters = and(
    eq(events.id, eventId),
    isArtistManager ? eq(events.artistManagerProfileId, profileId!) : undefined,
    isVenueManager ? eq(venues.managerProfileId, profileId!) : undefined,
  );

  try {
    const eventsResult = await database
      .select({
        id: events.id,
        title: events.title,

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
          artistId: artistAvailabilities.artistId,
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
          company: venues.company,
          vatCode: venues.vatCode,
        },

        venueManagerUserId: venueManagerUser.id,
        venueManagerUserStatus: venueManagerUser.status,
        venueManagerProfileId: venueManagerProfile.id,
        venueManagerProfileAvatarUrl: venueManagerProfile.avatarUrl,
        venueManagerProfileName: venueManagerProfile.name,
        venueManagerProfileSurname: venueManagerProfile.surname,

        status: events.status,
        masterEventId: events.masterEventId,
        revisionNumber: events.revisionNumber,
        protocolNumber: events.protocolNumber,
        revisionReason: events.revisionReason,
        revisionDescription: events.revisionDescription,
        revisionCreatedByUserId: events.revisionCreatedByUserId,
        revisionCreatedAt: events.revisionCreatedAt,
        hasConflict: events.hasConflict,
        guestLimit: events.guestLimit,

        artistManager: {
          id: users.id,
          status: users.status,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
          tourManagerPhone: profiles.phone,
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
        eventType: events.eventType,
        paymentDate: events.paymentDate,
        hostedEvent: events.hostedEvent,
      })
      .from(events)
      .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .innerJoin(artists, eq(events.artistId, artists.id))
      .leftJoin(profiles, eq(events.artistManagerProfileId, profiles.id))
      .leftJoin(users, eq(profiles.userId, users.id))
      .leftJoin(moCoordinators, eq(events.moCoordinatorId, moCoordinators.id))
      .leftJoin(venueManagerProfile, eq(venues.managerProfileId, venueManagerProfile.id))
      .leftJoin(venueManagerUser, eq(venueManagerProfile.userId, venueManagerUser.id))
      .where(filters)
      .limit(1);

    if (eventsResult.length === 0) {
      return null;
    }

    const eventIds = eventsResult.map((e) => e.id);

    const [notesResult, contractsResult, professionalsResult, guestsResult] = await Promise.all([
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

      database
        .select({
          eventId: contracts.eventId,
          id: contracts.id,
          status: contracts.status,
          contractDate: contracts.contractDate,
          fileUrl: contracts.fileUrl,
          fileName: contracts.fileName,
          recipientEmail: contracts.recipientEmail,
          createdAt: contracts.createdAt,
        })
        .from(contracts)
        .where(inArray(contracts.eventId, eventIds))
        .orderBy(desc(contracts.createdAt)),
      database
        .select({
          eventId: eventProfessionals.eventId,
          professionalId: eventProfessionals.professionalId,
        })
        .from(eventProfessionals)
        .where(inArray(eventProfessionals.eventId, eventIds)),
      database
        .select({
          id: eventGuests.id,
          eventId: eventGuests.eventId,
          fullName: eventGuests.fullName,
          email: eventGuests.email,
          originGroup: eventGuests.originGroup,
          colorTag: eventGuests.colorTag,
          status: eventGuests.status,
        })
        .from(eventGuests)
        .where(inArray(eventGuests.eventId, eventIds))
        .orderBy(eventGuests.createdAt),
    ]);

    const contractIds = contractsResult.map((c) => c.id);

    const [contractHistoryResult, contractCcsResult] = await Promise.all([
      contractIds.length
        ? database
            .select({
              contractId: contractHistory.contractId,
              id: contractHistory.id,
              fromStatus: contractHistory.fromStatus,
              toStatus: contractHistory.toStatus,
              fileUrl: contractHistory.fileUrl,
              fileName: contractHistory.fileName,
              note: contractHistory.note,
              changedByUserId: users.name,
              createdAt: contractHistory.createdAt,
            })
            .from(contractHistory)
            .leftJoin(users, eq(contractHistory.changedByUserId, users.id))
            .where(inArray(contractHistory.contractId, contractIds))
            .orderBy(contractHistory.contractId, desc(contractHistory.createdAt))
        : Promise.resolve([] as Array<any>),

      contractIds.length
        ? database
            .select({
              contractId: contractEmailCcs.contractId,
              email: contractEmailCcs.email,
            })
            .from(contractEmailCcs)
            .where(inArray(contractEmailCcs.contractId, contractIds))
        : Promise.resolve([] as Array<any>),
    ]);

    const notesByEvent: Record<number, EventNote[]> = {};
    for (const row of notesResult) {
      if (!notesByEvent[row.eventId]) notesByEvent[row.eventId] = [];
      notesByEvent[row.eventId].push({
        id: row.id,
        content: row.content,
        createdAt: row.createdAt,
      });
    }

    const professionalsByEvent: Record<number, number[]> = {};
    for (const row of professionalsResult) {
      if (!professionalsByEvent[row.eventId]) professionalsByEvent[row.eventId] = [];
      professionalsByEvent[row.eventId].push(row.professionalId);
    }

    const guestsByEvent: Record<number, EventAccreditationGuest[]> = {};
    for (const row of guestsResult) {
      if (!guestsByEvent[row.eventId]) guestsByEvent[row.eventId] = [];
      guestsByEvent[row.eventId].push(row);
    }

    const historiesByContract: Record<number, any[]> = {};
    for (const h of contractHistoryResult) {
      const arr = historiesByContract[h.contractId] ?? [];
      arr.push({
        id: h.id,
        fromStatus: h.fromStatus ?? null,
        toStatus: h.toStatus ?? null,
        fileUrl: h.fileUrl ?? null,
        fileName: h.fileName ?? null,
        note: h.note ?? null,
        changedByUserId: h.changedByUserId ?? null,
        createdAt: String(h.createdAt),
      });
      historiesByContract[h.contractId] = arr;
    }

    const ccsByContract: Record<number, string[]> = {};
    for (const row of contractCcsResult) {
      if (!ccsByContract[row.contractId]) ccsByContract[row.contractId] = [];
      ccsByContract[row.contractId].push(row.email);
    }

    const latestContractByEvent: Record<number, any> = {};
    for (const c of contractsResult) {
      if (!latestContractByEvent[c.eventId]) {
        latestContractByEvent[c.eventId] = {
          id: c.id,
          status: c.status,
          contractDate: c.contractDate,
          fileUrl: c.fileUrl,
          fileName: c.fileName,
          recipientEmail: c.recipientEmail,
          createdAt: c.createdAt,
          ccs: ccsByContract[c.id] ?? [],
          latestHistory: historiesByContract[c.id] ?? [],
        };
      }
    }

    const event = eventsResult[0] as any;
    const {
      venueManagerUserId,
      venueManagerUserStatus,
      venueManagerProfileId,
      venueManagerProfileAvatarUrl,
      venueManagerProfileName,
      venueManagerProfileSurname,
      ...rest
    } = event;

    const venueManager =
      venueManagerUserId
        ? {
            id: venueManagerUserId,
            profileId: venueManagerProfileId,
            status: venueManagerUserStatus,
            avatarUrl: venueManagerProfileAvatarUrl ?? null,
            name: venueManagerProfileName,
            surname: venueManagerProfileSurname,
          }
        : null;

    const merged = {
      ...rest,
      venue: {
        ...rest.venue,
        manager: venueManager,
      },
      notes: notesByEvent[rest.id] || [],
      contract: latestContractByEvent[rest.id] ?? null,
      professionalIds: professionalsByEvent[rest.id] || [],
      accreditationList: guestsByEvent[rest.id] || [],
    } as Event;

    if (!merged.artistManager?.id) merged.artistManager = null;
    if (!merged.moCoordinator?.id) merged.moCoordinator = null;

    return merged;
  } catch (error) {
    console.error('[getEventById] - Error:', error);
    throw new Error('Recupero evento non riuscito.');
  }
}
