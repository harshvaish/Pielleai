'use server';

import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { artistAvailabilities, eventNotes, events, eventProfessionals } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { buildEventProtocolNumber } from '@/lib/utils/event-revisions';
import { desc, eq, or, sql } from 'drizzle-orm';

export type CreateEventRevisionResponse = {
  eventId: number;
};

const schema = z.object({
  eventId: z.number().int().positive(),
  reason: z.string().min(3),
  description: z.string().min(3),
});

export async function createEventRevision(
  eventId: number,
  reason: string,
  description: string,
): Promise<ServerActionResponse<CreateEventRevisionResponse>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    const validation = schema.safeParse({ eventId, reason, description });
    if (!validation.success) {
      throw new AppError('Dati inviati non validi.');
    }

    const now = new Date();
    const response = await database.transaction(async (tx) => {
      const [seedEvent] = await tx
        .select({
          id: events.id,
          masterEventId: events.masterEventId,
          status: events.status,
        })
        .from(events)
        .where(eq(events.id, eventId))
        .limit(1);

      if (!seedEvent) {
        throw new AppError('Evento non trovato.');
      }

      const masterEventId = seedEvent.masterEventId ?? seedEvent.id;

      const [masterEvent] = await tx
        .select({
          id: events.id,
          status: events.status,
          protocolNumber: events.protocolNumber,
        })
        .from(events)
        .where(eq(events.id, masterEventId))
        .limit(1);

      if (!masterEvent || masterEvent.status !== 'ended') {
        throw new AppError('Solo eventi conclusi possono essere revisionati.');
      }

      const [latestEvent] = await tx
        .select()
        .from(events)
        .where(or(eq(events.id, masterEventId), eq(events.masterEventId, masterEventId)))
        .orderBy(desc(events.revisionNumber))
        .limit(1);

      if (!latestEvent) {
        throw new AppError('Impossibile recuperare la base della revisione.');
      }

      const [[{ maxRevision }]] = await Promise.all([
        tx
          .select({
            maxRevision: sql<number>`max(${events.revisionNumber})`,
          })
          .from(events)
          .where(or(eq(events.id, masterEventId), eq(events.masterEventId, masterEventId))),
      ]);

      const nextRevisionNumber = (maxRevision ?? 0) + 1;
      const masterProtocol = masterEvent.protocolNumber ?? buildEventProtocolNumber(masterEventId, 0);

      if (!masterEvent.protocolNumber) {
        await tx
          .update(events)
          .set({ protocolNumber: masterProtocol, updatedAt: now })
          .where(eq(events.id, masterEventId));
      }

      const [latestAvailability] = await tx
        .select({
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
        })
        .from(artistAvailabilities)
        .where(eq(artistAvailabilities.id, latestEvent.availabilityId))
        .limit(1);

      if (!latestAvailability) {
        throw new AppError('Disponibilita evento non trovata.');
      }

      const [newAvailability] = await tx
        .insert(artistAvailabilities)
        .values({
          artistId: latestEvent.artistId,
          startDate: latestAvailability.startDate,
          endDate: latestAvailability.endDate,
          status: 'booked',
          isRevision: true,
          createdAt: now,
          updatedAt: now,
        })
        .returning({ id: artistAvailabilities.id });

      if (!newAvailability?.id) {
        throw new AppError('Disponibilita revisione non creata.');
      }

      const {
        id: _id,
        availabilityId: _availabilityId,
        masterEventId: _masterEventId,
        revisionNumber: _revisionNumber,
        protocolNumber: _protocolNumber,
        revisionReason: _revisionReason,
        revisionDescription: _revisionDescription,
        revisionCreatedByUserId: _revisionCreatedByUserId,
        revisionCreatedAt: _revisionCreatedAt,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        ...copyable
      } = latestEvent;

      const protocolNumber = buildEventProtocolNumber(masterEventId, nextRevisionNumber);

      const [newEvent] = await tx
        .insert(events)
        .values({
          ...copyable,
          availabilityId: newAvailability.id,
          masterEventId,
          revisionNumber: nextRevisionNumber,
          protocolNumber,
          revisionReason: reason,
          revisionDescription: description,
          revisionCreatedByUserId: user.id,
          revisionCreatedAt: now,
          createdAt: now,
          updatedAt: now,
          hasConflict: false,
        })
        .returning({ id: events.id });

      const notes = await tx
        .select({
          writerId: eventNotes.writerId,
          content: eventNotes.content,
        })
        .from(eventNotes)
        .where(eq(eventNotes.eventId, latestEvent.id));

      if (notes.length) {
        await tx.insert(eventNotes).values(
          notes.map((note) => ({
            eventId: newEvent.id,
            writerId: note.writerId,
            content: note.content,
          })),
        );
      }

      const professionals = await tx
        .select({ professionalId: eventProfessionals.professionalId })
        .from(eventProfessionals)
        .where(eq(eventProfessionals.eventId, latestEvent.id));

      if (professionals.length) {
        await tx.insert(eventProfessionals).values(
          professionals.map((professional) => ({
            eventId: newEvent.id,
            professionalId: professional.professionalId,
          })),
        );
      }

      return { eventId: newEvent.id };
    });

    return { success: true, message: null, data: response };
  } catch (error) {
    console.error('[createEventRevision] - Error:', error);
    return {
      success: false,
      message:
        error instanceof AppError ? error.message : 'Creazione revisione non riuscita.',
      data: null,
    };
  }
}
