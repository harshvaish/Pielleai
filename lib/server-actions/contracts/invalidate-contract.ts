'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import getSession from '@/lib/data/auth/get-session';
import type { ServerActionResponse } from '@/lib/types';

import { contracts, contractEmailCcs, contractHistory } from '@/drizzle/schema';
import { voidEnvelope } from '@/docusign/docusignClient';

export type InvalidateContractInput = {
  contractId: number;
  note?: string;
};

export type InvalidateContractResult = {
  oldContractId: number;
  newContractId: number;
};

export async function invalidateContract(
  input: InvalidateContractInput,
): Promise<ServerActionResponse<InvalidateContractResult>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    if (!input || !Number.isInteger(input.contractId) || input.contractId <= 0) {
      throw new AppError('Contratto non valido.');
    }

    const note =
      typeof input.note === 'string' && input.note.trim().length
        ? input.note.trim().slice(0, 10_000)
        : null;

    const existing = await database.query.contracts.findFirst({
      where: (c, { eq }) => eq(c.id, input.contractId),
      columns: {
        id: true,
        status: true,
        artistId: true,
        venueId: true,
        eventId: true,
        recipientEmail: true,
        envelopeId: true,
        fileUrl: true,
        fileName: true,
      },
    });

    if (!existing) {
      throw new AppError('Contratto non trovato.');
    }

    // Best-effort: void outstanding envelopes to stop signing the invalid version.
    const canTryVoidEnvelope =
      Boolean(existing.envelopeId) &&
      existing.status !== 'signed' &&
      existing.status !== 'declined' &&
      existing.status !== 'voided';

    if (canTryVoidEnvelope) {
      try {
        await (voidEnvelope as any)({
          envelopeId: existing.envelopeId,
          reason: note ?? `Contract #${existing.id} invalidated by admin`,
        });
      } catch (err) {
        // Do not block invalidation if DocuSign void fails (e.g. already completed).
        console.warn('[invalidateContract] DocuSign void failed:', err);
      }
    }

    const result = await database.transaction(async (tx) => {
      const ccRows = await tx
        .select({ email: contractEmailCcs.email })
        .from(contractEmailCcs)
        .where(eq(contractEmailCcs.contractId, existing.id));

      const now = new Date();
      const today = now.toISOString().slice(0, 10);

      // 1) Mark old contract as voided (invalidated/archived)
      if (existing.status !== 'voided') {
        await tx
          .update(contracts)
          .set({ status: 'voided', updatedAt: now.toISOString() })
          .where(eq(contracts.id, existing.id));
      }

      await tx.insert(contractHistory).values({
        contractId: existing.id,
        fromStatus: existing.status,
        toStatus: 'voided',
        fileUrl: existing.fileUrl ?? null,
        fileName: existing.fileName ?? null,
        changedByUserId: user.id,
        note: note ?? 'Contratto invalidato. Creata una nuova revisione da firmare.',
      });

      // 2) Create new contract revision
      const [created] = await tx
        .insert(contracts)
        .values({
          status: 'draft',
          artistId: existing.artistId,
          venueId: existing.venueId,
          eventId: existing.eventId,
          contractDate: today,
          recipientEmail: existing.recipientEmail ?? null,
          fileUrl: null,
          fileName: null,
          envelopeId: null,
        })
        .returning({ id: contracts.id });

      if (!created?.id) {
        throw new AppError('Creazione nuovo contratto non riuscita.');
      }

      if (ccRows.length) {
        await tx.insert(contractEmailCcs).values(
          ccRows.map((row) => ({
            contractId: created.id,
            email: row.email,
          })),
        );
      }

      await tx.insert(contractHistory).values({
        contractId: created.id,
        fromStatus: null,
        toStatus: 'draft',
        fileUrl: null,
        fileName: null,
        changedByUserId: user.id,
        note: `Nuovo contratto creato come revisione del contratto #${existing.id}.`,
      });

      return { oldContractId: existing.id, newContractId: created.id };
    });

    revalidatePath('/documents');
    revalidatePath(`/documents/${result.oldContractId}`);
    revalidatePath(`/documents/${result.newContractId}`);
    revalidatePath(`/eventi/${existing.eventId}`);

    return { success: true, message: null, data: result };
  } catch (error) {
    console.error('[invalidateContract] error:', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Invalidazione contratto non riuscita.',
      data: null,
    };
  }
}

