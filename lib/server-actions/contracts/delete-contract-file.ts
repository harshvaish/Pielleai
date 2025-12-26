'use server';

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

// ------------------------------
// local (NON-exported) helpers
// ------------------------------
const CONTRACT_STATUS = [
  'draft',
  'queued',
  'sent',
  'viewed',
  'signed',
  'voided',
  'declined',
] as const;

type ContractStatus = (typeof CONTRACT_STATUS)[number];

type DeleteContractFileInput = {
  contractId: number;
};

type DeleteContractFileResult = {
  id: number;
  status: ContractStatus;
  contractDate: string;
  fileUrl: string | null;
  fileName: string | null;
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
    changedByUserId: string | null;
    createdAt: string;
  }>;
};

// ----------------------------------------------------
// ✅ ONLY exported value = async server action
// ----------------------------------------------------
export async function deleteContractFile(
  data: DeleteContractFileInput,
): Promise<ServerActionResponse<DeleteContractFileResult>> {
  try {
    // ------------------ Auth ------------------
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      throw new AppError('Non sei autorizzato.');
    }

    // ---------------- Validation (manual) ----------------
    if (
      !data ||
      typeof data.contractId !== 'number' ||
      !Number.isInteger(data.contractId) ||
      data.contractId <= 0
    ) {
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { contractId } = data;

    // ---------------- Transaction ----------------
    const result = await database.transaction(async (tx) => {
      // 1️⃣ Load existing
      const existing = await tx.query.contracts.findFirst({
        where: (c, { eq }) => eq(c.id, contractId),
        columns: {
          id: true,
          status: true,
          fileUrl: true,
          fileName: true,
        },
      });

      if (!existing) {
        throw new AppError('Contratto non trovato.');
      }

      // 2️⃣ Clear file fields
      const fileWasPresent = Boolean(existing.fileUrl || existing.fileName);

      await tx
        .update(contracts)
        .set({
          fileUrl: null,
          fileName: null,
          updatedAt: new Date() as any,
        })
        .where(eq(contracts.id, contractId));

      // 3️⃣ Insert history
      await tx.insert(contractHistory).values({
        contractId,
        fromStatus: existing.status as ContractStatus,
        toStatus: existing.status as ContractStatus,
        fileUrl: existing.fileUrl ?? null,
        fileName: existing.fileName ?? null,
        changedByUserId: user.id,
        note: fileWasPresent
          ? 'File contratto rimosso.'
          : 'Rimozione file richiesta (già assente).',
      });

      // 4️⃣ Hydrate response
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

      if (!base) {
        throw new AppError('Rimozione riuscita ma contratto non recuperabile.');
      }

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
      };
    });

    return { success: true, message: null, data: result };
  } catch (error) {
    console.error('[deleteContractFile]', error);

    return {
      success: false,
      message:
        error instanceof AppError
          ? error.message
          : 'Rimozione file contratto non riuscita.',
      data: null,
    };
  }
}
