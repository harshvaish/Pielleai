'use server';

import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';

// ⬇️ IMPORTANT: keep this path consistent with your connection.ts schema import
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

// ----- validation -----
export const contractCreateSchema = z.object({
  artistId: z.number().int().positive(),
  venueId: z.number().int().positive(),
  eventId: z.number().int().positive(),

  contractDate: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)), // YYYY-MM-DD
  fileUrl: z.string().url(),
  fileName: z.string().min(1),

  recipientEmail: z.string().email().optional(),
  ccEmails: z.array(z.string().email()).optional(),

  status: z.enum(CONTRACT_STATUS).default('draft').optional(),
  note: z.string().max(10_000).optional(),
});

export type ContractCreateInput = z.infer<typeof contractCreateSchema>;

export type CreateContractResult = {
  id: number;
  status: ContractStatus;
  contractDate: string;
  fileUrl: string;
  fileName: string;
  recipientEmail: string | null;

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

  latestHistory: null | {
    id: number;
    fromStatus: ContractStatus | null;
    toStatus: ContractStatus | null;
    fileUrl: string | null;
    fileName: string | null;
    note: string | null;
    createdAt: string; // ✅ keep as string for serialization + matches your query result
  };
};

// ----- action (createEvent-style) -----
export const createContract = async (
  data: ContractCreateInput,
): Promise<ServerActionResponse<CreateContractResult>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createContract] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      console.error('[createContract] - Error: unauthorized', user.role);
      throw new AppError('Non sei autorizzato.');
    }

    const validation = contractCreateSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createContract] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('I dati inviati non sono corretti.');
    }

    const {
      artistId,
      venueId,
      eventId,
      contractDate,
      fileUrl,
      fileName,
      recipientEmail,
      ccEmails = [],
      status = 'draft',
      note,
    } = validation.data;

    // Ensure referenced rows exist (same gate style as createEvent)
    const [artistRow, venueRow, eventRow] = await Promise.all([
      database.query.artists.findFirst({
        where: (a, { eq }) => eq(a.id, artistId),
        columns: { id: true },
      }),
      database.query.venues.findFirst({
        where: (v, { eq }) => eq(v.id, venueId),
        columns: { id: true },
      }),
      database.query.events.findFirst({
        where: (e, { eq }) => eq(e.id, eventId),
        columns: { id: true },
      }),
    ]);

    if (!artistRow) throw new AppError('Artista non trovato.');
    if (!venueRow) throw new AppError('Venue non trovata.');
    if (!eventRow) throw new AppError('Evento non trovato.');

    // Deduplicate CCs
    const finalCcs = Array.from(new Set(ccEmails.map((e) => e.toLowerCase().trim()))).filter(Boolean);

    const created = await database.transaction(async (tx) => {
      // STEP 1: INSERT CONTRACT -------------------------------------------------
      const [contractRow] = await tx
        .insert(contracts)
        .values({
          status: status as ContractStatus,
          artistId,
          venueId,
          eventId,
          contractDate, // YYYY-MM-DD
          fileUrl,
          fileName,
          recipientEmail: recipientEmail ?? null,
        })
        .returning({ id: contracts.id });

      const contractId = contractRow?.id;
      if (!contractId) {
        throw new AppError('Creazione contratto non riuscita.');
      }

      // STEP 2: INSERT CCs ------------------------------------------------------
      if (finalCcs.length) {
        await tx.insert(contractEmailCcs).values(
          finalCcs.map((email) => ({
            contractId,
            email,
          })),
        );
      }

      // STEP 3: INSERT HISTORY --------------------------------------------------
      await tx.insert(contractHistory).values({
        contractId,
        toStatus: status as ContractStatus,
        note: note ?? 'Contratto creato',
        changedByUserId: user.id,
        fileUrl,
        fileName,
      });

      // STEP 4: HYDRATE RESPONSE ------------------------------------------------
      const [base] = await tx
        .select({
          id: contracts.id,
          status: contracts.status,
          contractDate: contracts.contractDate,
          fileUrl: contracts.fileUrl,
          fileName: contracts.fileName,
          recipientEmail: contracts.recipientEmail,

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
        throw new AppError('Contratto creato ma non recuperabile.');
      }

      const ccsRows = await tx
        .select({ email: contractEmailCcs.email })
        .from(contractEmailCcs)
        .where(eq(contractEmailCcs.contractId, contractId));

      const histRows = await tx
        .select({
          id: contractHistory.id,
          fromStatus: contractHistory.fromStatus,
          toStatus: contractHistory.toStatus,
          fileUrl: contractHistory.fileUrl,
          fileName: contractHistory.fileName,
          note: contractHistory.note,
          createdAt: contractHistory.createdAt,
        })
        .from(contractHistory)
        .where(eq(contractHistory.contractId, contractId))
        .orderBy(desc(contractHistory.createdAt));

      const latest = histRows[0] ?? null;

      return {
        ...base,
        ccs: ccsRows.map((r) => r.email),
        latestHistory: latest
          ? {
              id: latest.id,
              fromStatus: (latest.fromStatus ?? null) as ContractStatus | null,
              toStatus: (latest.toStatus ?? null) as ContractStatus | null,
              fileUrl: latest.fileUrl ?? null,
              fileName: latest.fileName ?? null,
              note: latest.note ?? null,
              createdAt: String(latest.createdAt),
            }
          : null,
      } satisfies CreateContractResult;
    });

    // ✅ createEvent-style response: message must be null on success
    return {
      success: true,
      message: null,
      data: created,
    };
  } catch (error) {
    console.error('[createContract] transaction failed:', error);

    const msg =
      error instanceof AppError
        ? error.message
        : typeof (error as any)?.message === 'string' &&
            /unique|duplicate key|constraint/i.test((error as any).message)
          ? 'Violazione vincolo di unicità (esiste già un contratto attivo per questo evento).'
          : 'Creazione contratto non riuscita.';

    return {
      success: false,
      message: msg,
      data: null,
    };
  }
};
