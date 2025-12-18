'use server';

import { desc, eq } from 'drizzle-orm';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';

import {
  artists,
  venues,
  events,
  artistAvailabilities,
  contracts,
  contractEmailCcs,
  contractHistory,
} from '../../../drizzle/schema';

// ----- constants -----
const CONTRACT_STATUS = ['draft', 'queued', 'sent', 'viewed', 'signed', 'voided', 'declined'] as const;
export type ContractStatus = (typeof CONTRACT_STATUS)[number];

// ----- input -----
export type CreateContractInput = {
  eventId: number;

  // contract table fields
  contractDate?: string | number | Date; // REQUIRED by DB, we fallback if missing
  recipientEmail?: string;
  status?: ContractStatus; // defaults to 'draft'
  note?: string;
  ccEmails?: string[];

  // write-through payload fields
  artistName?: string;
  artistStageName?: string;

  venueName?: string;
  venueCompanyName?: string;
  venueVatNumber?: string;
  venueAddress?: string;

  eventType?: string;

  eventDate?: string | number | Date; // update availability.startDate (combine with perfomanceTime)
  perfomanceTime?: string; // "HH:mm"

  transfortCost?: string | number; // events.transportationsCost
  totalCost?: string | number; // events.totalCost
  upfrontPayment?: string | number; // events.artistUpfrontCost
  paymentDate?: string | number | Date; // events.paymentDate (string mode)
};

// ----- output (adjust as you like) -----
export type CreateContractResult = {
  id: number;
  status: ContractStatus;
  contractDate: string;
  fileUrl: string | null;
  fileName: string | null;
  recipientEmail: string | null;

  artist: { id: number; name: string | null; surname: string | null; stageName: string | null };
  venue: { id: number; name: string | null; company: string | null; vatCode: string | null; address: string | null };

  event: {
    id: number;
    status: string | null;
    eventType: string | null;
    paymentDate: string | null;
    transportationsCost: string | null;
    totalCost: string | null;
    artistUpfrontCost: string | null;
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

function cleanStr(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim().replace(/\s+/g, ' ');
  return s.length ? s : null;
}

function toNumericString(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : null;
  if (typeof v === 'string') {
    const s = v.trim();
    return s.length ? s : null;
  }
  return null;
}

function normalizeToYyyyMmDd(input: string | number | Date): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new AppError('Data contratto non valida.');
  return d.toISOString().slice(0, 10);
}

function toISOStringOrThrow(input: string | number | Date, errMsg: string): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new AppError(errMsg);
  return d.toISOString();
}

/**
 * Rule:
 * - if artistName has 2+ words -> first word = name, remaining = surname
 * - if artistName has 1 word -> update only name
 */
function splitArtistName(full: unknown): { name?: string; surname?: string } {
  const cleaned = cleanStr(full);
  if (!cleaned) return {};
  const parts = cleaned.split(' ');
  if (parts.length === 1) return { name: parts[0] };
  return { name: parts[0], surname: parts.slice(1).join(' ') };
}

function hasKeys(obj: Record<string, unknown>) {
  return Object.keys(obj).length > 0;
}

/**
 * Combines eventDate + perfomanceTime ("HH:mm") into a Date.
 * If perfomanceTime invalid/missing -> keep date as-is.
 */
function buildEventStartDate(eventDate: string | number | Date, perfomanceTime?: string | null): Date {
  const d = eventDate instanceof Date ? new Date(eventDate) : new Date(eventDate);
  if (Number.isNaN(d.getTime())) throw new AppError('Data evento non valida.');

  const t = cleanStr(perfomanceTime);
  if (!t) return d;

  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return d;

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return d;

  d.setHours(hh, mm, 0, 0);
  return d;
}

// ----- action -----
export const createContract = async (
  data: CreateContractInput,
): Promise<ServerActionResponse<CreateContractResult>> => {
  try {
    console.log(data,'datarecievefd')
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createContract] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      console.error('[createContract] - Error: unauthorized', user.role);
      throw new AppError('Non sei autorizzato.');
    }

    const eventId = data?.eventId;
    if (!Number.isInteger(eventId) || eventId <= 0) throw new AppError('Evento non valido.');

    const statusCandidate = (data.status ?? 'draft') as ContractStatus;
    const status: ContractStatus = CONTRACT_STATUS.includes(statusCandidate) ? statusCandidate : 'draft';

    const recipientEmail =
      typeof data.recipientEmail === 'string' && data.recipientEmail.trim()
        ? data.recipientEmail.trim()
        : null;

    if (recipientEmail && !isValidEmail(recipientEmail)) {
      throw new AppError('Email destinatario non valida.');
    }

    const note =
      typeof data.note === 'string' && data.note.length ? data.note.slice(0, 10_000) : undefined;

    const ccEmails: string[] = Array.from(
      new Set(
        (Array.isArray(data.ccEmails) ? data.ccEmails : [])
          .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
          .map((e) => e.toLowerCase().trim())
          .filter((e) => isValidEmail(e)),
      ),
    );

    // Fetch ids needed for contract insert + write-through updates
    const ev = await database.query.events.findFirst({
      where: (e, { eq }) => eq(e.id, eventId),
      columns: { id: true, artistId: true, venueId: true, availabilityId: true },
    });

    if (!ev) throw new AppError('Evento non trovato.');

    const contractDate = normalizeToYyyyMmDd(data.contractDate ?? data.eventDate ?? new Date());

    const created = await database.transaction(async (tx) => {
      // 1) Create contract (your contracts schema requires artistId, venueId, eventId, contractDate)
      const [contractRow] = await tx
        .insert(contracts)
        .values({
          artistId: ev.artistId,
          venueId: ev.venueId,
          eventId,
          contractDate,
          status,
          recipientEmail,
          fileUrl: null,
          fileName: null,
        })
        .returning({ id: contracts.id });

      const contractId = contractRow?.id;
      if (!contractId) throw new AppError('Creazione contratto non riuscita.');

      // 2) Write-through updates

      // --- artists ---
      const artistPatch: Partial<typeof artists.$inferInsert> = {};
      const split = splitArtistName(data.artistName);
      if (split.name) artistPatch.name = split.name;
      if (split.surname) artistPatch.surname = split.surname;

      const stageName = cleanStr(data.artistStageName);
      if (stageName) artistPatch.stageName = stageName;

      if (hasKeys(artistPatch)) {
        await tx.update(artists).set(artistPatch).where(eq(artists.id, ev.artistId));
      }

      // --- venues ---
      const venuePatch: Partial<typeof venues.$inferInsert> = {};
      const venueName = cleanStr(data.venueName);
      if (venueName) venuePatch.name = venueName;

      const venueCompanyName = cleanStr(data.venueCompanyName);
      if (venueCompanyName) venuePatch.company = venueCompanyName;

      const venueVatNumber = cleanStr(data.venueVatNumber);
      if (venueVatNumber) venuePatch.vatCode = venueVatNumber;

      const venueAddress = cleanStr(data.venueAddress);
      if (venueAddress) venuePatch.address = venueAddress;

      if (hasKeys(venuePatch)) {
        await tx.update(venues).set(venuePatch).where(eq(venues.id, ev.venueId));
      }

      // --- events ---
      const eventPatch: Partial<typeof events.$inferInsert> = {};
      const eventType = cleanStr(data.eventType);
      if (eventType) eventPatch.eventType = eventType;

      const transportCost = toNumericString(data.transfortCost);
      if (transportCost !== null) eventPatch.transportationsCost = transportCost;

      const totalCost = toNumericString(data.totalCost);
      if (totalCost !== null) eventPatch.totalCost = totalCost;

      const upfrontPayment = toNumericString(data.upfrontPayment);
      if (upfrontPayment !== null) eventPatch.artistUpfrontCost = upfrontPayment;

      if (data.paymentDate) {
        eventPatch.paymentDate = toISOStringOrThrow(data.paymentDate, 'Data pagamento non valida.');
      }

      if (hasKeys(eventPatch)) {
        await tx.update(events).set(eventPatch).where(eq(events.id, eventId));
      }

      // --- availability startDate (eventDate + perfomanceTime) ---
      if (data.eventDate && ev.availabilityId) {
        const start = buildEventStartDate(data.eventDate, data.perfomanceTime);
        await tx
          .update(artistAvailabilities)
          .set({ startDate: start.toISOString() })
          .where(eq(artistAvailabilities.id, ev.availabilityId));
      }

      // 3) CCs
      if (ccEmails.length) {
        await tx.insert(contractEmailCcs).values(
          ccEmails.map((email) => ({
            contractId,
            email,
          })),
        );
      }

      // 4) History
      await tx.insert(contractHistory).values({
        contractId,
        toStatus: status,
        note: note ?? 'Contratto creato',
        changedByUserId: user.id,
        fileUrl: null,
        fileName: null,
      });

      // 5) Hydrate response (contract + event + artist + venue)
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
          },

          venue: {
            id: venues.id,
            name: venues.name,
            company: venues.company,
            vatCode: venues.vatCode,
            address: venues.address,
          },

          event: {
            id: events.id,
            status: events.status,
            eventType: events.eventType,
            paymentDate: events.paymentDate,
            transportationsCost: events.transportationsCost,
            totalCost: events.totalCost,
            artistUpfrontCost: events.artistUpfrontCost,
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
        contractDate: String(base.contractDate),
        recipientEmail: base.recipientEmail ?? null,
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

    return { success: true, message: null, data: created };
  } catch (error) {
    console.error('[createContract] failed:', error);

    const msg =
      error instanceof AppError
        ? error.message
        : typeof (error as any)?.message === 'string' &&
            /unique|duplicate key|constraint/i.test((error as any).message)
          ? 'Esiste già un contratto per questo evento.'
          : 'Creazione contratto non riuscita.';

    return { success: false, message: msg, data: null };
  }
};
