'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { createContract } from '@/lib/server-actions/contracts/create-contract';
import { editContract } from '@/lib/server-actions/contracts/update-contract';

import { contracts, events, artistAvailabilities } from '../../../drizzle/schema';

type AttachDocumentInput = {
  eventId: number;
  fileUrl: string;
  fileName: string;
};

export async function attachContractDocument(
  input: AttachDocumentInput,
): Promise<ServerActionResponse<{ contractId: number }>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    if (!Number.isInteger(input.eventId) || input.eventId <= 0) {
      throw new AppError('Evento non valido.');
    }

    const [existing] = await database
      .select({ id: contracts.id })
      .from(contracts)
      .where(eq(contracts.eventId, input.eventId))
      .limit(1);

    if (existing?.id) {
      const response = await editContract({
        contractId: existing.id,
        fileUrl: input.fileUrl,
        fileName: input.fileName,
      });

      if (!response.success) {
        throw new AppError(response.message || 'Aggiornamento contratto non riuscito.');
      }

      revalidatePath('/documents');
      revalidatePath(`/documents/${existing.id}`);

      return {
        success: true,
        message: null,
        data: { contractId: existing.id },
      };
    }

    const [eventRow] = await database
      .select({ startDate: artistAvailabilities.startDate })
      .from(events)
      .leftJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .where(eq(events.id, input.eventId))
      .limit(1);

    const created = await createContract({
      eventId: input.eventId,
      eventDate: eventRow?.startDate ?? undefined,
      fileUrl: input.fileUrl,
      fileName: input.fileName,
    });

    if (!created.success || !created.data) {
      throw new AppError(created.message || 'Creazione contratto non riuscita.');
    }

    revalidatePath('/documents');
    revalidatePath(`/documents/${created.data.id}`);

    return {
      success: true,
      message: null,
      data: { contractId: created.data.id },
    };
  } catch (error) {
    const message = error instanceof AppError ? error.message : 'Operazione non riuscita.';
    return { success: false, message, data: null };
  }
}

export async function attachTechnicalRiderDocument(
  input: AttachDocumentInput,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    if (!Number.isInteger(input.eventId) || input.eventId <= 0) {
      throw new AppError('Evento non valido.');
    }

    const [updated] = await database
      .update(events)
      .set({
        tecnicalRiderUrl: input.fileUrl,
        tecnicalRiderName: input.fileName,
      })
      .where(eq(events.id, input.eventId))
      .returning({ id: events.id });

    if (!updated?.id) {
      throw new AppError('Aggiornamento rider tecnico non riuscito.');
    }

    revalidatePath('/documents');
    revalidatePath('/documents/technical-ride');

    return { success: true, message: null, data: null };
  } catch (error) {
    const message = error instanceof AppError ? error.message : 'Operazione non riuscita.';
    return { success: false, message, data: null };
  }
}
