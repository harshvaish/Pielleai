'server only';

import { User } from '@/lib/auth';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { alias } from 'drizzle-orm/pg-core';
import {
  artists,
  events,
  artistAvailabilities,
  venues,
  eventNotes,
  profiles,
  users,
  moCoordinators,
} from '@/lib/database/schema';
import { Event, EventNote, EventsTableFilters } from '@/lib/types';
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';
import { contracts, contractEmailCcs, contractHistory } from '../../../drizzle/schema';
import { latestRevisionFilter } from './revision-helpers';

const venueManagerProfile = alias(profiles, 'venueManagerProfile');
const venueManagerUser = alias(users, 'venueManagerUser');

export async function getEvents(
  user: User,
  {
    currentPage,
    status,
    conflict,
    artistIds,
    artistManagerIds,
    venueIds,
    startDate,
    endDate,
  }: EventsTableFilters,
): Promise<{
  data: Event[];
  totalPages: number;
  currentPage: number;
}> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;
  const isPaginated = Number.isInteger(currentPage) && (currentPage as number) > 0;
  const safePage = isPaginated ? (currentPage as number) : 1;
  const offset = (safePage - 1) * limit;

  const isAdmin = user.role === 'admin';
  const isArtistManager = user.role === 'artist-manager';
  const isVenueManager = user.role === 'venue-manager';

  // normalize incoming filters
  let artistManagerIdsFilter = (artistManagerIds ?? []).map(Number);
  let venueIdsFilter = (venueIds ?? []).map(Number);

  const rangeWindow =
    startDate && endDate
      ? sql`tstzrange(
            ${startDate}::timestamptz,
            ${endDate}::timestamptz,
            '[)')`
      : undefined;

  try {
    if (!isAdmin) {
      const profileId = await getUserProfileIdCached(user.id);
      if (!profileId) throw new Error('Recupero profilo non riuscito.');

      if (isArtistManager) {
        artistManagerIdsFilter = [profileId];
      }

      if (isVenueManager && venueIdsFilter.length === 0) {
        const results = await database
          .select({
            id: venues.id,
          })
          .from(venues)
          .where(and(eq(venues.managerProfileId, profileId), eq(venues.status, 'active')));

        venueIdsFilter = [...results.map((r) => r.id)];
      }
    }

    // Build reusable filters
    const filters = and(
      latestRevisionFilter,
      status.length > 0 ? inArray(events.status, status) : undefined,
      conflict ? eq(events.hasConflict, true) : undefined,
      artistIds.length > 0 ? inArray(events.artistId, artistIds.map(Number)) : undefined,
      artistManagerIdsFilter.length > 0
        ? inArray(events.artistManagerProfileId, artistManagerIdsFilter)
        : undefined,
      isVenueManager
        ? inArray(events.venueId, venueIdsFilter)
        : venueIdsFilter.length > 0
          ? inArray(events.venueId, venueIdsFilter)
          : undefined,
      rangeWindow ? sql`${artistAvailabilities.timeRange} && ${rangeWindow}` : undefined,
    );

    // Base query
    let baseQuery = database
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
          tourManagerEmail: artists.tourManagerEmail,
          tourManagerName: artists.tourManagerName,
          tourManagerSurname: artists.tourManagerSurname,
          tourManagerPhone: artists.tourManagerPhone,
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

        // ---- flat venue manager fields (we'll compose venue.manager in JS) ----
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

        artistManager: {
          id: users.id,
          status: users.status,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
          tourManagerPhone: profiles.phone  
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
        eventType:events.eventType,
        paymentDate:events.paymentDate
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
      .orderBy(artistAvailabilities.startDate);

    // Apply pagination only if requested
    if (isPaginated) {
      // @ts-expect-error drizzle typing allows chaining here at runtime
      baseQuery = baseQuery.limit(limit).offset(offset);
    }

    const eventsResult = await baseQuery;
    const eventIds = eventsResult.map((e) => e.id);

    // --- fetch notes, count, contracts ---
    const [notesResult, [{ eventCount }], contractsResult] = await Promise.all([
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
        : Promise.resolve([]),

      database
        .select({ eventCount: count() })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .where(filters),

      eventIds.length
        ? database
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
            .orderBy(desc(contracts.createdAt)) // newest first
        : Promise.resolve([] as Array<any>),
    ]);

    const contractIds = contractsResult.map((c) => c.id);

    // --- fetch contract latest history + contract CCs ---
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

    // all history per contractId (newest-first)
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

    // ccs per contractId
    const ccsByContract: Record<number, string[]> = {};
    for (const row of contractCcsResult) {
      if (!ccsByContract[row.contractId]) ccsByContract[row.contractId] = [];
      ccsByContract[row.contractId].push(row.email);
    }

    // Pick latest contract per eventId (contractsResult is newest-first)
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

          // ✅ attach CC + all history entries (newest-first)
          ccs: ccsByContract[c.id] ?? [],
          latestHistory: historiesByContract[c.id] ?? [],
        };
      }
    }

    // Merge + compose venue.manager + attach latest contract + nullify missing relations
    const mergedResult: Event[] = eventsResult.map((event) => {
      const {
        venueManagerUserId,
        venueManagerUserStatus,
        venueManagerProfileId,
        venueManagerProfileAvatarUrl,
        venueManagerProfileName,
        venueManagerProfileSurname,
        ...rest
      } = event as any;

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

      const newObj = {
        ...rest,
        venue: {
          ...rest.venue,
          manager: venueManager,
        },
        notes: notesByEvent[rest.id] || [],

        // ✅ THIS is what you needed (contract response includes ccs)
        contract: latestContractByEvent[rest.id] ?? null,
      } as Event;

      if (!newObj.artistManager?.id) newObj.artistManager = null;
      if (!newObj.moCoordinator?.id) newObj.moCoordinator = null;

      return newObj;
    });
console.log(mergedResult, "merged results")
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
