'use server';

import sgMail from '@sendgrid/mail';
import { z } from 'zod/v4';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { events, artistAvailabilities, artists, venues, eventNotes } from '@/lib/database/schema';
import { contracts, contractHistory } from '@/drizzle/schema';
import { ServerActionResponse } from '@/lib/types';
import { recomputeConflicts } from '@/lib/data/events/recompute-conflicts';
import { createEventStatusTimestamps } from '@/lib/utils/payment-flow';
import { generateEventTitle } from '@/lib/utils/generate-event-title';
import { TIME_ZONE } from '@/lib/constants';
import { and, eq, inArray, ne, sql } from 'drizzle-orm';

const schema = z.object({
  eventId: z.number().int().positive(),
  reason: z.string().min(3).max(2000),
});

type EmailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
};

async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new AppError('Configurazione errata del server: Chiave API SendGrid mancante.');
  }

  sgMail.setApiKey(apiKey);
  await sgMail.send({
    to: payload.to,
    from: 'info@eaglebooking.it',
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}

function formatEventDate(startDate: Date, endDate: Date) {
  const start = format(toZonedTime(startDate, TIME_ZONE), "dd/MM/yyyy 'alle' HH:mm", {
    locale: it,
  });
  const end = format(toZonedTime(endDate, TIME_ZONE), "dd/MM/yyyy 'alle' HH:mm", {
    locale: it,
  });
  return { start, end };
}

export async function removeApprovedVenue(
  eventId: number,
  reason: string,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    const validation = schema.safeParse({ eventId, reason });
    if (!validation.success) {
      throw new AppError('Dati inviati non validi.');
    }

    const now = new Date();
    const trimmedReason = validation.data.reason.trim();

    const result = await database.transaction(async (tx) => {
      const [eventRow] = await tx
        .select({
          id: events.id,
          title: events.title,
          status: events.status,
          paymentStatus: events.paymentStatus,
          artistId: events.artistId,
          venueId: events.venueId,
          availability: {
            id: artistAvailabilities.id,
            startDate: artistAvailabilities.startDate,
            endDate: artistAvailabilities.endDate,
          },
          artist: {
            name: artists.name,
            surname: artists.surname,
            stageName: artists.stageName,
            email: artists.email,
            tourManagerEmail: artists.tourManagerEmail,
          },
          venue: {
            name: venues.name,
            billingEmail: venues.billingEmail,
            billingPec: venues.billingPec,
          },
        })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .innerJoin(artists, eq(events.artistId, artists.id))
        .innerJoin(venues, eq(events.venueId, venues.id))
        .where(eq(events.id, eventId))
        .limit(1);

      if (!eventRow) {
        throw new AppError('Evento non trovato.');
      }

      const paymentStatus = eventRow.paymentStatus ?? 'pending';
      const allowedEventStatus = ['pre-confirmed', 'confirmed'].includes(eventRow.status);
      const isPreConfirmedAwaitingContract =
        eventRow.status === 'pre-confirmed' && paymentStatus === 'pending';
      const isContractSignedAwaitingUpfront = paymentStatus === 'upfront-required';
      const isBookedAwaitingBalance = ['upfront-paid', 'balance-required'].includes(paymentStatus);
      const isFullyConfirmed = ['fully-paid', 'balance-paid'].includes(paymentStatus);

      if (!allowedEventStatus) {
        throw new AppError('Rimozione consentita solo per eventi pre-confermati o confermati.');
      }

      if (!isPreConfirmedAwaitingContract && !isContractSignedAwaitingUpfront && !isBookedAwaitingBalance) {
        throw new AppError('Rimozione non consentita per lo stato corrente dell evento.');
      }

      if (isFullyConfirmed) {
        throw new AppError('Rimozione non consentita: evento gia completamente confermato.');
      }

      const [contractRow] = await tx
        .select({
          id: contracts.id,
          status: contracts.status,
          fileUrl: contracts.fileUrl,
          fileName: contracts.fileName,
        })
        .from(contracts)
        .where(eq(contracts.eventId, eventId))
        .limit(1);

      let contractStatusUpdate: string | null = null;

      if (contractRow) {
        const notePrefix =
          contractRow.status === 'signed'
            ? 'Contratto firmato archiviato'
            : contractRow.status === 'voided'
              ? 'Contratto gia archiviato'
              : 'Contratto invalidato';

        if (contractRow.status !== 'voided') {
          await tx
            .update(contracts)
            .set({
              status: 'voided',
              updatedAt: now.toISOString(),
            })
            .where(eq(contracts.id, contractRow.id));
        }

        await tx.insert(contractHistory).values({
          contractId: contractRow.id,
          fromStatus: contractRow.status,
          toStatus: 'voided',
          fileUrl: contractRow.fileUrl ?? null,
          fileName: contractRow.fileName ?? null,
          changedByUserId: user.id,
          note: `${notePrefix} per rimozione locale. Motivo: ${trimmedReason}`,
        });

        contractStatusUpdate =
          contractRow.status === 'voided' ? 'Contratto gia archiviato' : `${contractRow.status} -> voided`;
      }

      await tx
        .update(events)
        .set({
          status: 'rejected',
          hasConflict: false,
          paymentStatus: 'expired',
          paymentExpiredAt: now,
          updatedAt: now,
          ...createEventStatusTimestamps('rejected'),
        })
        .where(eq(events.id, eventId));

      const rangeWindow = sql`tstzrange(${eventRow.availability.startDate}::timestamptz, ${eventRow.availability.endDate}::timestamptz, '[)')`;

      const otherCandidates = await tx
        .select({
          id: events.id,
          venue: {
            name: venues.name,
            billingEmail: venues.billingEmail,
            billingPec: venues.billingPec,
          },
        })
        .from(events)
        .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
        .innerJoin(venues, eq(events.venueId, venues.id))
        .where(
          and(
            ne(events.id, eventRow.id),
            eq(events.artistId, eventRow.artistId),
            inArray(events.status, ['pre-confirmed']),
            inArray(events.paymentStatus, ['pending', 'upfront-required']),
            sql`${artistAvailabilities.timeRange} && ${rangeWindow}`,
          ),
        );

      const availabilityOutcome =
        otherCandidates.length > 0
          ? 'Disponibilita rimasta pre-confermata (altri candidati presenti)'
          : 'Disponibilita tornata disponibile (nessun candidato approvato)';

      const noteParts = [
        'Rimozione locale approvato.',
        `Motivo: ${trimmedReason}`,
        `Stato precedente: ${eventRow.status}`,
        `Stato pagamento precedente: ${eventRow.paymentStatus ?? 'N/A'}`,
        availabilityOutcome,
        contractStatusUpdate ? `Contratto: ${contractStatusUpdate}` : 'Contratto: assente',
      ];

      await tx.insert(eventNotes).values({
        writerId: user.id,
        eventId,
        content: noteParts.join(' | '),
      });

      await recomputeConflicts(tx, eventRow.artistId);

      return {
        event: eventRow,
        contractStatusUpdate,
        otherCandidates,
        availabilityOutcome,
      };
    });

    const artistLabel = result.event.artist.stageName?.trim()
      ? result.event.artist.stageName.trim()
      : `${result.event.artist.name} ${result.event.artist.surname}`.trim();

    const eventTitle = result.event.title?.trim()
      ? result.event.title.trim()
      : generateEventTitle(
          artistLabel,
          result.event.venue.name,
          result.event.availability.startDate,
          result.event.availability.endDate,
        );

    const { start, end } = formatEventDate(
      result.event.availability.startDate,
      result.event.availability.endDate,
    );

    const venueEmail = result.event.venue.billingEmail || result.event.venue.billingPec;

    if (venueEmail) {
      sendEmail({
        to: venueEmail,
        subject: `Rimozione locale dall'evento - ${eventTitle}`,
        text: `Gentile team ${result.event.venue.name},\n\n` +
          `L'evento "${eventTitle}" e stato rimosso dalla vostra sede.\n` +
          `Data: ${start} - ${end}\n` +
          `Motivo: ${trimmedReason}\n\n` +
          `Per ulteriori informazioni, contattate il team di booking.`,
        html: `
          <p>Gentile team <strong>${result.event.venue.name}</strong>,</p>
          <p>L'evento <strong>${eventTitle}</strong> e stato rimosso dalla vostra sede.</p>
          <p><strong>Data:</strong> ${start} - ${end}<br/>
          <strong>Motivo:</strong> ${trimmedReason}</p>
          <p>Per ulteriori informazioni, contattate il team di booking.</p>
        `,
      }).catch((error) => {
        console.error('[removeApprovedVenue] - Failed to notify venue:', error);
      });
    }

    if (result.otherCandidates.length > 0) {
      result.otherCandidates.forEach((candidate) => {
        const candidateEmail = candidate.venue.billingEmail || candidate.venue.billingPec;
        if (!candidateEmail) return;

        sendEmail({
          to: candidateEmail,
          subject: `Evento disponibile - ${eventTitle}`,
          text: `L'evento "${eventTitle}" e tornato disponibile.\n` +
            `Data: ${start} - ${end}\n\n` +
            `Se interessati, contattate il team di booking.`,
          html: `
            <p>L'evento <strong>${eventTitle}</strong> e tornato disponibile.</p>
            <p><strong>Data:</strong> ${start} - ${end}</p>
            <p>Se interessati, contattate il team di booking.</p>
          `,
        }).catch((error) => {
          console.error('[removeApprovedVenue] - Failed to notify candidate:', error);
        });
      });
    }

    const adminRecipients =
      process.env.ASSISTANCE_NOTIFICATION_EMAILS ||
      process.env.EVENT_CONFIRMED_NOTIFICATION_EMAILS;

    if (adminRecipients) {
      const adminList = adminRecipients.split(',').map((email) => email.trim()).filter(Boolean);
      if (adminList.length > 0) {
        sendEmail({
          to: adminList,
          subject: `Rimozione locale approvato - Evento #${result.event.id}`,
          text: `Rimozione locale approvato\n\n` +
            `Evento: ${eventTitle}\n` +
            `Artista: ${artistLabel}\n` +
            `Locale: ${result.event.venue.name}\n` +
            `Data: ${start} - ${end}\n` +
            `Motivo: ${trimmedReason}\n` +
            `Stato precedente: ${result.event.status}\n` +
            `Pagamento precedente: ${result.event.paymentStatus ?? 'N/A'}\n` +
            `${result.availabilityOutcome}\n` +
            `${result.contractStatusUpdate ? `Contratto: ${result.contractStatusUpdate}\n` : 'Contratto: assente\n'}
`,
          html: `
            <p><strong>Rimozione locale approvato</strong></p>
            <p><strong>Evento:</strong> ${eventTitle}<br/>
            <strong>Artista:</strong> ${artistLabel}<br/>
            <strong>Locale:</strong> ${result.event.venue.name}<br/>
            <strong>Data:</strong> ${start} - ${end}</p>
            <p><strong>Motivo:</strong> ${trimmedReason}</p>
            <p><strong>Stato precedente:</strong> ${result.event.status}<br/>
            <strong>Pagamento precedente:</strong> ${result.event.paymentStatus ?? 'N/A'}<br/>
            <strong>Esito disponibilita:</strong> ${result.availabilityOutcome}<br/>
            <strong>Contratto:</strong> ${result.contractStatusUpdate ?? 'assente'}</p>
          `,
        }).catch((error) => {
          console.error('[removeApprovedVenue] - Failed to notify admin:', error);
        });
      }
    }

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[removeApprovedVenue] - Error:', error);
    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Rimozione locale non riuscita.',
      data: null,
    };
  }
}
