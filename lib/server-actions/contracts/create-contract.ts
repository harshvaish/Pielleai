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

// ----- constants -----
const CONTRACT_STATUS = ['draft', 'queued', 'sent', 'viewed', 'signed', 'voided'] as const;
type ContractStatus = (typeof CONTRACT_STATUS)[number];

// ----- types -----
export type ContractCreateInput = {
  artistId: number;
  venueId: number;
  eventId: number;

  contractDate: string | number | Date; // Date, ISO string, timestamp
  recipientEmail?: string;
  ccEmails?: string[];

  status?: ContractStatus;
  note?: string;
};

export type CreateContractResult = {
  id: number;
  status: ContractStatus;
  contractDate: string;
  fileUrl: string | null;
  fileName: string | null;
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
    createdAt: string;
  };
};

// ----- helpers -----
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeToYyyyMmDd(input: string | number | Date): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new AppError('Data contratto non valida.');
  return d.toISOString().slice(0, 10);
}

type ParsedContractInput = {
  artistId: number;
  venueId: number;
  eventId: number;
  contractDate: string;
  recipientEmail: string | null;
  ccEmails: string[];
  status: ContractStatus;
  note?: string;
};

function parseContractInput(input: ContractCreateInput): ParsedContractInput {
  const { artistId, venueId, eventId } = input;

  if (!Number.isInteger(artistId) || artistId <= 0) throw new AppError('Artista non valido.');
  if (!Number.isInteger(venueId) || venueId <= 0) throw new AppError('Venue non valida.');
  if (!Number.isInteger(eventId) || eventId <= 0) throw new AppError('Evento non valido.');

  const contractDate = normalizeToYyyyMmDd(input.contractDate);

  const recipientEmail =
    typeof input.recipientEmail === 'string' && input.recipientEmail.trim()
      ? input.recipientEmail.trim()
      : null;

  if (recipientEmail && !isValidEmail(recipientEmail)) {
    throw new AppError('Email destinatario non valida.');
  }

  if (input.ccEmails !== undefined && !Array.isArray(input.ccEmails)) {
    throw new AppError('CC emails non validi.');
  }

  const ccEmails: string[] = Array.from(
    new Set(
      (input.ccEmails ?? [])
        .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
        .map((e) => e.toLowerCase().trim())
        .filter((e) => isValidEmail(e)),
    ),
  );

  const statusCandidate = (input.status ?? 'draft') as ContractStatus;
  const status: ContractStatus = CONTRACT_STATUS.includes(statusCandidate) ? statusCandidate : 'draft';

  const note =
    typeof input.note === 'string' && input.note.length ? input.note.slice(0, 10_000) : undefined;

  return { artistId, venueId, eventId, contractDate, recipientEmail, ccEmails, status, note };
}

// ----- action -----
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

    const { artistId, venueId, eventId, contractDate, recipientEmail, ccEmails, status, note } =
      parseContractInput(data);

    // Ensure referenced rows exist
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

    const created = await database.transaction(async (tx) => {
      // STEP 1: INSERT CONTRACT (file is NULL for now)
      const [contractRow] = await tx
        .insert(contracts)
        .values({
          status,
          artistId,
          venueId,
          eventId,
          contractDate,
          recipientEmail,
          fileUrl: null,
          fileName: null,
        })
        .returning({ id: contracts.id });

      const contractId = contractRow?.id;
      if (!contractId) throw new AppError('Creazione contratto non riuscita.');

      // STEP 2: INSERT CCs
      if (ccEmails.length) {
        await tx.insert(contractEmailCcs).values(
          ccEmails.map((email) => ({
            contractId,
            email,
          })),
        );
      }

      // STEP 3: INSERT HISTORY
      await tx.insert(contractHistory).values({
        contractId,
        toStatus: status,
        note: note ?? 'Contratto creato',
        changedByUserId: user.id,
        fileUrl: null,
        fileName: null,
      });

      // STEP 4: HYDRATE RESPONSE
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

      if (!base) throw new AppError('Contratto creato ma non recuperabile.');

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
    console.log(created,'created')
    return { success: true, message: null, data: created };
  } catch (error) {
    console.error('[createContract] transaction failed:', error);

    const msg =
      error instanceof AppError
        ? error.message
        : typeof (error as any)?.message === 'string' &&
            /unique|duplicate key|constraint/i.test((error as any).message)
          ? 'Violazione vincolo di unicità (esiste già un contratto attivo per questo evento).'
          : 'Creazione contratto non riuscita.';

    return { success: false, message: msg, data: null };
  }
};
