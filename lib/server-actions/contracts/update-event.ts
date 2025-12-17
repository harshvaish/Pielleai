'use server';

import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';

import {
  contracts,
  contractEmailCcs,
  contractHistory,
  artists,
  venues,
  events,
} from '../../../drizzle/schema';

// ----- constants -----
const CONTRACT_STATUS = ['draft', 'queued', 'sent', 'viewed', 'signed', 'voided'] as const;
type ContractStatus = (typeof CONTRACT_STATUS)[number];

// ------------- Validation -------------
export const contractEditSchema = z.object({
  contractId: z.number().int().positive(),

  // optional fields to update
  status: z.enum(CONTRACT_STATUS).optional(),
  contractDate: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)).optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().min(1).optional(),
  recipientEmail: z.string().email().nullable().optional(),

  // optional CCs (replaces existing)
  ccEmails: z.array(z.string().email()).optional(),

  // optional note for history
  note: z.string().max(10_000).optional(),
});

export type ContractEditInput = z.infer<typeof contractEditSchema>;

export type EditContractResult = {
  id: number;
  status: ContractStatus;
  contractDate: string;
  fileUrl: string;
  fileName: string;
  recipientEmail: string | null;
  createdAt: string | null;
  updatedAt: string | null;

  artist: {
    id: number;
    name: string | null;
    surname: string | null;
    stageName: string | null;
    avatarUrl: string | null;
    status: string | null;
    slug: string | null;
  };

  venue: {
    id: number;
    name: string | null;
    address: string | null;
    status: string | null;
    slug: string | null;
    avatarUrl: string | null;
  };

  event: {
    id: number;
    status: string | null;
  };

  ccs: string[];

  history: Array<{
    id: number;
    fromStatus: ContractStatus | null;
    toStatus: ContractStatus | null;
    fileUrl: string | null;
    fileName: string | null;
    note: string | null;
    changedByUserId: string | null; // ✅ uuid/string (matches your error)
    createdAt: string;
  }>;
};

// ----- action (createEvent-style) -----
export const editContract = async (
  data: ContractEditInput,
): Promise<ServerActionResponse<EditContractResult>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[editContract] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      console.error('[editContract] - Error: unauthorized', user.role);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = contractEditSchema.safeParse(data);

    if (!validation.success) {
      console.error('[editContract] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { contractId, status, contractDate, fileUrl, fileName, recipientEmail, ccEmails, note } =
      validation.data;

    const updated = await database.transaction(async (tx) => {
      // STEP 1: FIND EXISTING CONTRACT -----------------------------------------
      const existing = await tx.query.contracts.findFirst({
        where: (c, { eq }) => eq(c.id, contractId),
        columns: {
          id: true,
          status: true,
          contractDate: true,
          fileUrl: true,
          fileName: true,
          recipientEmail: true,
        },
      });

      if (!existing) throw new AppError('Contratto non trovato.');

      // STEP 2: UPDATE CONTRACT -------------------------------------------------
      const updateValues: Partial<typeof contracts.$inferInsert> = {};

      if (status !== undefined) updateValues.status = status as ContractStatus;
      if (contractDate !== undefined) updateValues.contractDate = contractDate as any;
      if (fileUrl !== undefined) updateValues.fileUrl = fileUrl;
      if (fileName !== undefined) updateValues.fileName = fileName;
      if (recipientEmail !== undefined) updateValues.recipientEmail = recipientEmail ?? null;

      if (Object.keys(updateValues).length > 0) {
        // NOTE: if your updatedAt column is timestamp, change to: new Date()
        (updateValues as any).updatedAt = new Date().toISOString();
        await tx.update(contracts).set(updateValues).where(eq(contracts.id, contractId));
      }

      // STEP 3: REPLACE CCs (if provided) --------------------------------------
      if (ccEmails !== undefined) {
        const deduped = Array.from(new Set(ccEmails.map((e) => e.toLowerCase().trim()))).filter(Boolean);

        await tx.delete(contractEmailCcs).where(eq(contractEmailCcs.contractId, contractId));

        if (deduped.length) {
          await tx.insert(contractEmailCcs).values(
            deduped.map((email) => ({
              contractId,
              email,
            })),
          );
        }
      }

      // STEP 4: INSERT HISTORY --------------------------------------------------
      const toStatus = (status ?? existing.status) as ContractStatus;

      await tx.insert(contractHistory).values({
        contractId,
        fromStatus: existing.status as ContractStatus,
        toStatus,
        fileUrl: fileUrl ?? existing.fileUrl ?? null,
        fileName: fileName ?? existing.fileName ?? null,
        changedByUserId: user.id, // user.id is likely uuid/string in your app
        note: note ?? 'Contratto aggiornato',
      });

      // STEP 5: HYDRATE RESPONSE ------------------------------------------------
      const [base] = await tx
        .select({
          id: contracts.id,
          status: contracts.status,
          contractDate: contracts.contractDate,
          fileUrl: contracts.fileUrl,
          fileName: contracts.fileName,
          recipientEmail: contracts.recipientEmail,
          createdAt: contracts.createdAt,
          updatedAt: contracts.updatedAt,

          artist: {
            id: artists.id,
            name: artists.name,
            surname: artists.surname,
            stageName: artists.stageName,
            avatarUrl: artists.avatarUrl,
            status: artists.status,
            slug: artists.slug,
          },
          venue: {
            id: venues.id,
            name: venues.name,
            address: venues.address,
            status: venues.status,
            slug: venues.slug,
            avatarUrl: venues.avatarUrl,
          },
          event: {
            id: events.id,
            status: events.status,
          },
        })
        .from(contracts)
        .innerJoin(artists, eq(contracts.artistId, artists.id))
        .innerJoin(venues, eq(contracts.venueId, venues.id))
        .innerJoin(events, eq(contracts.eventId, events.id))
        .where(eq(contracts.id, contractId));

      if (!base) throw new AppError('Aggiornamento riuscito ma contratto non recuperabile.');

      const ccs = await tx
        .select({ email: contractEmailCcs.email })
        .from(contractEmailCcs)
        .where(eq(contractEmailCcs.contractId, contractId));

      const historyRows = await tx
        .select({
          id: contractHistory.id,
          fromStatus: contractHistory.fromStatus,
          toStatus: contractHistory.toStatus,
          fileUrl: contractHistory.fileUrl,
          fileName: contractHistory.fileName,
          note: contractHistory.note,
          changedByUserId: contractHistory.changedByUserId,
          createdAt: contractHistory.createdAt,
        })
        .from(contractHistory)
        .where(eq(contractHistory.contractId, contractId))
        .orderBy(desc(contractHistory.createdAt));

      return {
        ...base,
        ccs: ccs.map((c) => c.email),
        history: historyRows.map((h) => ({
          id: h.id,
          fromStatus: (h.fromStatus ?? null) as ContractStatus | null,
          toStatus: (h.toStatus ?? null) as ContractStatus | null,
          fileUrl: h.fileUrl ?? null,
          fileName: h.fileName ?? null,
          note: h.note ?? null,
          changedByUserId: h.changedByUserId ?? null,
          createdAt: String(h.createdAt),
        })),
      } satisfies EditContractResult;
    });

    return {
      success: true,
      message: null,
      data: updated,
    };
  } catch (error) {
    console.error('[editContract] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento contratto non riuscito.',
      data: null,
    };
  }
};
