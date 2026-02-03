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
import { ServerActionResponse } from '@/lib/types';
import { TIME_ZONE } from '@/lib/constants';
import { generateEventTitle } from '@/lib/utils/generate-event-title';
import { recomputeConflicts } from '@/lib/data/events/recompute-conflicts';
import { eq } from 'drizzle-orm';

const cancellationSchema = z.object({
  eventId: z.number().int().positive(),
  requestedBy: z.enum(['venue', 'booking']),
  bookingCancellationType: z.enum(['peaceful', 'legal-dispute']).optional(),
  notes: z
    .string({ error: 'Motivazione non valida.' })
    .trim()
    .min(3, 'Inserisci almeno 3 caratteri.')
    .max(2000, 'Massimo 2000 caratteri.'),
});

type CancellationInput = z.infer<typeof cancellationSchema>;

type EmailPayload = {
  to: string[];
  subject: string;
  text: string;
  html: string;
};

const REQUESTED_BY_LABELS: Record<CancellationInput['requestedBy'], string> = {
  venue: 'Locale',
  booking: 'Booking',
};

const CANCELLATION_TYPE_LABELS: Record<'venue' | 'peaceful' | 'legal-dispute', string> = {
  venue: 'Annullamento locale',
  peaceful: 'Annullamento pacifico',
  'legal-dispute': 'Contestazione legale',
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function formatEventDate(startDate: Date, endDate: Date) {
  const start = format(toZonedTime(startDate, TIME_ZONE), "dd/MM/yyyy 'alle' HH:mm", {
    locale: it,
  });
  const end = format(toZonedTime(endDate, TIME_ZONE), "dd/MM/yyyy 'alle' HH:mm", {
    locale: it,
  });
  return { start, end };
}

async function sendLegalDisputeEmail(payload: EmailPayload, apiKey: string) {
  sgMail.setApiKey(apiKey);
  await sgMail.send({
    to: payload.to,
    from: 'info@eaglebooking.it',
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}

export async function cancelEvent(
  input: CancellationInput,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    const validation = cancellationSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non validi.');
    }

    const { eventId, requestedBy, bookingCancellationType, notes } = validation.data;
    const trimmedNotes = notes.trim();
    const cancellationType =
      requestedBy === 'venue' ? 'venue' : bookingCancellationType;

    if (!cancellationType) {
      throw new AppError('Seleziona il tipo di annullamento richiesto dal booking.');
    }

    const now = new Date();

    const [eventRow] = await database
      .select({
        id: events.id,
        title: events.title,
        status: events.status,
        artistId: events.artistId,
        availability: {
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
        },
        artist: {
          name: artists.name,
          surname: artists.surname,
          stageName: artists.stageName,
        },
        venue: {
          name: venues.name,
          address: venues.address,
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

    if (['cancelled', 'in-dispute'].includes(eventRow.status)) {
      throw new AppError('Evento gia annullato.');
    }

    if (eventRow.status === 'ended') {
      throw new AppError('Evento gia concluso.');
    }

    if (eventRow.status === 'rejected') {
      throw new AppError('Evento gia rifiutato.');
    }

    const newStatus = cancellationType === 'legal-dispute' ? 'in-dispute' : 'cancelled';
    const shouldRecomputeConflicts = ['proposed', 'pre-confirmed'].includes(eventRow.status);

    await database.transaction(async (tx) => {
      await tx
        .update(events)
        .set({
          status: newStatus,
          hasConflict: false,
          cancellationRequestedBy: requestedBy,
          cancellationType,
          cancellationAt: now,
          cancellationUserId: user.id,
          cancellationUserRole: user.role,
          cancellationNotes: trimmedNotes,
          cancellationAccountingCompleted: cancellationType === 'peaceful' ? false : null,
          cancellationAccountingCompletedAt: null,
          cancellationLegalEmailSentAt: null,
          cancellationLegalEmailTo: null,
          updatedAt: now,
        })
        .where(eq(events.id, eventId));

      const noteParts = [
        'Annullamento evento registrato.',
        `Richiedente: ${REQUESTED_BY_LABELS[requestedBy]}`,
        `Tipo: ${CANCELLATION_TYPE_LABELS[cancellationType]}`,
        `Motivo: ${trimmedNotes}`,
        `Stato precedente: ${eventRow.status}`,
      ];

      await tx.insert(eventNotes).values({
        writerId: user.id,
        eventId,
        content: noteParts.join(' | '),
      });

      if (shouldRecomputeConflicts) {
        await recomputeConflicts(tx, eventRow.artistId);
      }
    });

    if (cancellationType === 'legal-dispute') {
      const apiKey = process.env.SENDGRID_API_KEY;
      if (!apiKey) {
        await database.insert(eventNotes).values({
          writerId: user.id,
          eventId,
          content: 'Email contestazione legale non inviata: chiave SendGrid mancante.',
        });
        throw new AppError('Configurazione errata del server: Chiave API SendGrid mancante.');
      }

      const legalRecipients = process.env.LEGAL_DISPUTE_NOTIFICATION_EMAILS;
      if (!legalRecipients) {
        await database.insert(eventNotes).values({
          writerId: user.id,
          eventId,
          content: 'Email contestazione legale non inviata: destinatari mancanti.',
        });
        throw new AppError('Nessun destinatario configurato per le contestazioni legali.');
      }

      const emailList = legalRecipients
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);

      if (emailList.length === 0) {
        throw new AppError('Nessun destinatario valido per le contestazioni legali.');
      }

      const artistLabel = eventRow.artist.stageName?.trim()
        ? eventRow.artist.stageName.trim()
        : `${eventRow.artist.name} ${eventRow.artist.surname}`.trim();

      const eventTitle = eventRow.title?.trim()
        ? eventRow.title.trim()
        : generateEventTitle(
            artistLabel,
            eventRow.venue.name,
            eventRow.availability.startDate,
            eventRow.availability.endDate,
          );

      const { start, end } = formatEventDate(
        eventRow.availability.startDate,
        eventRow.availability.endDate,
      );

      const requestedByLabel = REQUESTED_BY_LABELS[requestedBy];
      const cancellationTypeLabel = CANCELLATION_TYPE_LABELS['legal-dispute'];

      const text = `Contestazione legale evento\n\n` +
        `Evento: ${eventTitle}\n` +
        `Artista: ${artistLabel}\n` +
        `Locale: ${eventRow.venue.name}\n` +
        `Data: ${start} - ${end}\n` +
        `Richiedente: ${requestedByLabel}\n` +
        `Tipo: ${cancellationTypeLabel}\n` +
        `Motivazione: ${trimmedNotes}\n`;

      const html = `
        <p><strong>Contestazione legale evento</strong></p>
        <p><strong>Evento:</strong> ${escapeHtml(eventTitle)}<br/>
        <strong>Artista:</strong> ${escapeHtml(artistLabel)}<br/>
        <strong>Locale:</strong> ${escapeHtml(eventRow.venue.name)}<br/>
        <strong>Data:</strong> ${escapeHtml(start)} - ${escapeHtml(end)}<br/>
        <strong>Richiedente:</strong> ${escapeHtml(requestedByLabel)}<br/>
        <strong>Tipo:</strong> ${escapeHtml(cancellationTypeLabel)}</p>
        <p><strong>Motivazione:</strong></p>
        <p>${escapeHtml(trimmedNotes).replace(/\n/g, '<br/>')}</p>
      `;

      try {
        await sendLegalDisputeEmail(
          {
            to: emailList,
            subject: `Contestazione legale evento - ${eventTitle}`,
            text,
            html,
          },
          apiKey,
        );

        const sentAt = new Date();
        const sentAtLabel = format(toZonedTime(sentAt, TIME_ZONE), 'dd/MM/yyyy HH:mm', {
          locale: it,
        });

        await database
          .update(events)
          .set({
            cancellationLegalEmailSentAt: sentAt,
            cancellationLegalEmailTo: emailList.join(', '),
            updatedAt: sentAt,
          })
          .where(eq(events.id, eventId));

        await database.insert(eventNotes).values({
          writerId: user.id,
          eventId,
          content: `Email contestazione legale inviata a ${emailList.join(', ')} il ${sentAtLabel}.`,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'errore sconosciuto';

        await database.insert(eventNotes).values({
          writerId: user.id,
          eventId,
          content: `Invio email contestazione legale fallito: ${errorMessage}.`,
        });

        if (error instanceof AppError) {
          throw error;
        }

        throw new AppError('Email legale non inviata. Verifica la configurazione e riprova.');
      }
    }

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[cancelEvent] - Error:', error);
    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Annullamento evento non riuscito.',
      data: null,
    };
  }
}
