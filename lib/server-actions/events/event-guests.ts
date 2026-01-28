'use server';

import { database } from '@/lib/database/connection';
import { eventGuests, events, venues, profiles, users } from '@/lib/database/schema';
import { ServerActionResponse, EventGuest } from '@/lib/types';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';
import {
  createEventGuestSchema,
  deleteEventGuestSchema,
  inviteEventGuestsSchema,
  sendAccreditationListSchema,
  updateEventGuestSchema,
} from '@/lib/validation/event-guest-schema';
import { AppError } from '@/lib/classes/AppError';
import { count, eq, inArray } from 'drizzle-orm';
import { sendEventGuestInviteEmail } from '../send-event-guest-invite-email';
import { getEventSummary } from '@/lib/data/events/get-event-summary';
import { generateEventTitle } from '@/lib/utils/generate-event-title';
import { sendEventAccreditationListEmail } from '../send-event-accreditation-list-email';

const mapGuestRow = (guest: EventGuest) => guest;

export async function createEventGuest(
  input: {
    eventId: number;
    fullName: string;
    email?: string | null;
    originGroup: 'artist' | 'artist-manager' | 'booking' | 'major';
    colorTag: 'green' | 'yellow' | 'red';
    allowOverLimit?: boolean;
  },
): Promise<ServerActionResponse<EventGuest>> {
  try {
    const { session, user } = await getSession();

    const isAdmin = Boolean(user && hasRole(user, ['admin']));
    if (!session || !user || user.banned || !hasRole(user, ['admin', 'artist-manager'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = createEventGuestSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const { eventId, fullName, email, originGroup, colorTag, allowOverLimit } = validation.data;

    const [eventRow] = await database
      .select({ guestLimit: events.guestLimit })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!eventRow) {
      throw new AppError('Evento non trovato.');
    }

    const [countRow] = await database
      .select({ total: count() })
      .from(eventGuests)
      .where(eq(eventGuests.eventId, eventId));

    const totalGuests = Number(countRow?.total ?? 0);
    const limitReached = totalGuests >= eventRow.guestLimit;

    if (limitReached && !allowOverLimit) {
      throw new AppError('Limite invitati raggiunto.');
    }

    if (limitReached && allowOverLimit && !isAdmin) {
      throw new AppError('Solo un admin puo superare il limite invitati.');
    }

    const cleanedEmail = email?.trim().length ? email.trim() : null;

    const [created] = await database
      .insert(eventGuests)
      .values({
        eventId,
        fullName: fullName.trim(),
        email: cleanedEmail,
        originGroup,
        colorTag,
      })
      .returning({
        id: eventGuests.id,
        eventId: eventGuests.eventId,
        fullName: eventGuests.fullName,
        email: eventGuests.email,
        originGroup: eventGuests.originGroup,
        colorTag: eventGuests.colorTag,
        status: eventGuests.status,
        invitedAt: eventGuests.invitedAt,
        createdAt: eventGuests.createdAt,
        updatedAt: eventGuests.updatedAt,
      });

    return { success: true, message: null, data: mapGuestRow(created as EventGuest) };
  } catch (error) {
    console.error('[createEventGuest] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Creazione invitato non riuscita.',
      data: null,
    };
  }
}

export async function updateEventGuest(
  input: {
    guestId: number;
    fullName: string;
    email?: string | null;
    originGroup: 'artist' | 'artist-manager' | 'booking' | 'major';
    colorTag: 'green' | 'yellow' | 'red';
    status: 'to-invite' | 'invited' | 'attending' | 'not-attending';
  },
): Promise<ServerActionResponse<EventGuest>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['admin', 'artist-manager'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = updateEventGuestSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const { guestId, fullName, email, status, originGroup, colorTag } = validation.data;
    const cleanedEmail = email?.trim().length ? email.trim() : null;

    const [updated] = await database
      .update(eventGuests)
      .set({
        fullName: fullName.trim(),
        email: cleanedEmail,
        originGroup,
        colorTag,
        status,
        updatedAt: new Date(),
      })
      .where(eq(eventGuests.id, guestId))
      .returning({
        id: eventGuests.id,
        eventId: eventGuests.eventId,
        fullName: eventGuests.fullName,
        email: eventGuests.email,
        originGroup: eventGuests.originGroup,
        colorTag: eventGuests.colorTag,
        status: eventGuests.status,
        invitedAt: eventGuests.invitedAt,
        createdAt: eventGuests.createdAt,
        updatedAt: eventGuests.updatedAt,
      });

    if (!updated) {
      throw new AppError('Invitato non trovato.');
    }

    return { success: true, message: null, data: mapGuestRow(updated as EventGuest) };
  } catch (error) {
    console.error('[updateEventGuest] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento invitato non riuscito.',
      data: null,
    };
  }
}

export async function deleteEventGuest(
  input: { guestId: number },
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['admin', 'artist-manager'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = deleteEventGuestSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const result = await database.delete(eventGuests).where(eq(eventGuests.id, validation.data.guestId));
    if (result.rowCount === 0) {
      throw new AppError('Invitato non trovato.');
    }

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[deleteEventGuest] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Eliminazione invitato non riuscita.',
      data: null,
    };
  }
}

export async function inviteEventGuests(
  input: { eventId: number; guestIds: number[] },
): Promise<ServerActionResponse<{ invitedIds: number[]; failedEmails: string[] }>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['admin', 'artist-manager'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = inviteEventGuestsSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const { eventId, guestIds } = validation.data;

    const event = await getEventSummary(eventId);
    if (!event) {
      throw new AppError('Evento non trovato.');
    }

    const artistName = `${event.artist.name} ${event.artist.surname}`.trim();
    const artistLabel = event.artist.stageName?.trim() || artistName;
    const eventTitle =
      event.title?.trim() ||
      generateEventTitle(artistLabel, event.venue.name, event.startDate, event.endDate);

    const guestsToInvite = await database
      .select({
        id: eventGuests.id,
        fullName: eventGuests.fullName,
        email: eventGuests.email,
      })
      .from(eventGuests)
      .where(inArray(eventGuests.id, guestIds));

    if (guestsToInvite.length === 0) {
      throw new AppError('Nessun invitato selezionato.');
    }

    await database
      .update(eventGuests)
      .set({ status: 'invited', invitedAt: new Date(), updatedAt: new Date() })
      .where(inArray(eventGuests.id, guestsToInvite.map((guest) => guest.id)));

    const failedEmails: string[] = [];

    await Promise.all(
      guestsToInvite
        .filter((guest) => guest.email)
        .map(async (guest) => {
          const email = guest.email as string;
          const response = await sendEventGuestInviteEmail({
            email,
            guestName: guest.fullName,
            eventTitle,
            venueName: event.venue.name,
            startDate: event.startDate,
            endDate: event.endDate,
          });

          if (!response.success) {
            failedEmails.push(email);
          }
        }),
    );

    return {
      success: true,
      message: null,
      data: { invitedIds: guestsToInvite.map((guest) => guest.id), failedEmails },
    };
  } catch (error) {
    console.error('[inviteEventGuests] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Invio inviti non riuscito.',
      data: null,
    };
  }
}

export async function sendAccreditationList(
  input: { eventId: number },
): Promise<ServerActionResponse<{ invitedIds: number[]; failedEmails: string[] }>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['admin', 'artist-manager'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = sendAccreditationListSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const { eventId } = validation.data;

    const event = await getEventSummary(eventId);
    if (!event) {
      throw new AppError('Evento non trovato.');
    }

    const [venueRow] = await database
      .select({
        venueName: venues.name,
        venueEmail: venues.billingEmail,
        venueManagerEmail: users.email,
        venueManagerName: profiles.name,
        venueManagerSurname: profiles.surname,
      })
      .from(events)
      .innerJoin(venues, eq(events.venueId, venues.id))
      .leftJoin(profiles, eq(venues.managerProfileId, profiles.id))
      .leftJoin(users, eq(profiles.userId, users.id))
      .where(eq(events.id, eventId))
      .limit(1);

    if (!venueRow) {
      throw new AppError('Venue non trovata.');
    }

    const recipientEmail = venueRow.venueManagerEmail || venueRow.venueEmail;
    if (!recipientEmail) {
      throw new AppError('Email del locale non disponibile.');
    }

    const guests = await database
      .select({
        id: eventGuests.id,
        fullName: eventGuests.fullName,
        email: eventGuests.email,
        originGroup: eventGuests.originGroup,
        colorTag: eventGuests.colorTag,
        status: eventGuests.status,
      })
      .from(eventGuests)
      .where(eq(eventGuests.eventId, eventId))
      .orderBy(eventGuests.createdAt);

    if (guests.length === 0) {
      throw new AppError('Nessun invitato presente.');
    }

    const artistName = `${event.artist.name} ${event.artist.surname}`.trim();
    const artistLabel = event.artist.stageName?.trim() || artistName;
    const eventTitle =
      event.title?.trim() ||
      generateEventTitle(artistLabel, event.venue.name, event.startDate, event.endDate);

    const groupedGuests = guests.reduce<Record<string, typeof guests>>((acc, guest) => {
      const key = guest.originGroup;
      if (!acc[key]) acc[key] = [];
      acc[key].push(guest);
      return acc;
    }, {});

    const venueEmailResponse = await sendEventAccreditationListEmail({
      email: recipientEmail,
      venueName: venueRow.venueName,
      venueManagerName: venueRow.venueManagerName
        ? `${venueRow.venueManagerName} ${venueRow.venueManagerSurname ?? ''}`.trim()
        : null,
      eventTitle,
      startDate: event.startDate,
      endDate: event.endDate,
      groups: groupedGuests,
    });

    if (!venueEmailResponse.success) {
      throw new AppError(venueEmailResponse.message || 'Invio email al locale non riuscito.');
    }

    const failedEmails: string[] = [];

    const guestsWithEmail = guests.filter((guest) => guest.email);

    await Promise.all(
      guestsWithEmail.map(async (guest) => {
          const email = guest.email as string;
          const response = await sendEventGuestInviteEmail({
            email,
            guestName: guest.fullName,
            eventTitle,
            venueName: event.venue.name,
            startDate: event.startDate,
            endDate: event.endDate,
          });

          if (!response.success) {
            failedEmails.push(email);
          }
        }),
    );

    const guestsToInvite = guestsWithEmail.filter((guest) => guest.status === 'to-invite');
    const invitedRows =
      guestsToInvite.length > 0
        ? await database
            .update(eventGuests)
            .set({ status: 'invited', invitedAt: new Date(), updatedAt: new Date() })
            .where(inArray(eventGuests.id, guestsToInvite.map((guest) => guest.id)))
            .returning({ id: eventGuests.id })
        : [];

    return {
      success: true,
      message: null,
      data: { invitedIds: invitedRows.map((row) => row.id), failedEmails },
    };
  } catch (error) {
    console.error('[sendAccreditationList] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Invio lista accrediti non riuscito.',
      data: null,
    };
  }
}
