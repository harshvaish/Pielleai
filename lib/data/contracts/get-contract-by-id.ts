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
const CONTRACT_STATUS = ['draft', 'queued', 'sent', 'viewed', 'signed', 'voided','declined'] as const;
type ContractStatus = (typeof CONTRACT_STATUS)[number];

// ----- validation -----
export const getContractDetailSchema = z.object({
  contractId: z.number().int().positive(),
});

export type GetContractDetailInput = z.infer<typeof getContractDetailSchema>;

// ----- result type -----
export type GetContractDetailResult = {
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

// ----- action -----
export const getContractDetailById = async (
  data: GetContractDetailInput,
): Promise<ServerActionResponse<GetContractDetailResult>> => {
  try {
    // Auth
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[getContractDetailById] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      console.error('[getContractDetailById] - Error: unauthorized', user.role);
      throw new AppError('Non sei autorizzato.');
    }

    // Validate
    const validation = getContractDetailSchema.safeParse(data);

    if (!validation.success) {
      console.error(
        '[getContractDetailById] - Error: validation failed',
        validation.error.issues[0],
      );
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { contractId } = validation.data;

    // STEP 1: base contract + joins -------------------------------------------
    const [base] = await database
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
      throw new AppError('Contratto non trovato.');
    }

    // STEP 2: CCs --------------------------------------------------------------
    const ccs = await database
      .select({ email: contractEmailCcs.email })
      .from(contractEmailCcs)
      .where(eq(contractEmailCcs.contractId, contractId));

    // STEP 3: History ----------------------------------------------------------
    const historyRows = await database
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
      success: true,
      message: null,
      data: {
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
      },
    };
  } catch (error) {
    console.error('[getContractDetailById] failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Recupero contratto non riuscito.',
      data: null,
    };
  }
};
