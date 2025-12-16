'server only';

import { User } from '@/lib/auth';
import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { and, count, desc, eq, gte, inArray, lte } from 'drizzle-orm';

import {
  contracts,
  contractEmailCcs,
  contractHistory,
  artists,
  venues,
  events,
} from '../../../drizzle/schema';

// ----- constants -----
export const CONTRACT_STATUS = ['draft', 'queued', 'sent', 'viewed', 'signed', 'voided'] as const;
export type ContractStatus = (typeof CONTRACT_STATUS)[number];

export type ContractListFilters = {
  currentPage?: number | null;   // ✅ allow null (matches EventsTableFilters)
  status?: Array<ContractStatus | 'all'>;
  startDate?: string | null;
  endDate?: string | null;
  sort?: 'asc' | 'desc';
};

// default last month (same logic you had)
function defaultLastMonth(): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end);
  start.setMonth(end.getMonth() - 1);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

function resolveDateRange(input?: { start?: string | null; end?: string | null }) {
  const fallback = defaultLastMonth();
  const start = input?.start ?? null;
  const end = input?.end ?? null;

  if (!start || !end) return fallback;
  return start > end ? { start: end, end: start } : { start, end };
}

function normalizeStatus(status?: Array<ContractStatus | 'all'>): ContractStatus[] | null {
  const arr = status ?? [];
  if (!arr.length) return null;
  if (arr.includes('all')) return null;

  const allowed = new Set(CONTRACT_STATUS as readonly string[]);
  const filtered = arr.filter((s): s is ContractStatus => allowed.has(s));
  return filtered.length ? filtered : null;
}

// ----- main function (getEvents structure) -----
export async function getContracts(
  user: User,
  {
    currentPage,
    status,
    startDate,
    endDate,
    sort = 'desc',
  }: ContractListFilters,
): Promise<{
  data: Array<{
    id: number;
    status: ContractStatus;
    contractDate: string;
    fileUrl: string | null;
    fileName: string | null;
    recipientEmail: string;
    createdAt: string;

    artist: {
      id: number;
      name: string | null;
      surname: string | null;
      stageName: string | null;
      avatarUrl: string | null;
      status: string;
      slug: string | null;
    };

    venue: {
      id: number;
      name: string;
      address: string | null;
      status: string;
      slug: string | null;
      avatarUrl: string | null;
    };

    event: {
      id: number;
      status: string;
    };

    ccs: string[];
    history: Array<{
      id: number;
      fromStatus: ContractStatus;
      toStatus: ContractStatus;
      fileUrl: string | null;
      fileName: string | null;
      note: string | null;
      changedByUserId: number;
      createdAt: string;
    }>;
  }>;
  totalPages: number;
  currentPage: number;
}> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;
  const isPaginated =
  typeof currentPage === 'number' && Number.isInteger(currentPage) && currentPage > 0;
  const safePage = isPaginated ? currentPage : 1;
  const offset = (safePage - 1) * limit;

  try {
    // 🔒 auth (mirror your contract route: admin-only)
    if (!user || user.role !== 'admin') {
      throw new Error('Non sei autorizzato.');
    }

    const { start, end } = resolveDateRange({ start: startDate ?? null, end: endDate ?? null });
    const statusValues = normalizeStatus(status);

    // Reusable filters (same idea as getEvents)
    const filters = and(
      gte(contracts.contractDate, start),
      lte(contracts.contractDate, end),
      statusValues ? inArray(contracts.status, statusValues) : undefined,
    );

    // Base query
    let baseQuery = database
      .select({
        id: contracts.id,
        status: contracts.status,
        contractDate: contracts.contractDate,
        fileUrl: contracts.fileUrl,
        fileName: contracts.fileName,
        recipientEmail: contracts.recipientEmail,
        createdAt: contracts.createdAt,

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
      .where(filters)
      .orderBy(sort === 'asc' ? contracts.createdAt : desc(contracts.createdAt));

    // Apply pagination only if requested (same as getEvents)
    if (isPaginated) {
      // @ts-expect-error drizzle typing allows chaining here at runtime
      baseQuery = baseQuery.limit(limit).offset(offset);
    }

    const rows = await baseQuery;
    const contractIds = rows.map((r) => r.id);

    // Enrich + count (same Promise.all pattern as getEvents)
    const [historyRows, ccsRows, [{ total }]] = await Promise.all([
      contractIds.length
        ? database
            .select({
              contractId: contractHistory.contractId,
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
            .where(inArray(contractHistory.contractId, contractIds))
            .orderBy(desc(contractHistory.createdAt))
        : Promise.resolve([]),

      contractIds.length
        ? database
            .select({
              contractId: contractEmailCcs.contractId,
              email: contractEmailCcs.email,
            })
            .from(contractEmailCcs)
            .where(inArray(contractEmailCcs.contractId, contractIds))
        : Promise.resolve([]),

      database
        .select({ total: count() })
        .from(contracts)
        .where(filters),
    ]);

    // Group history by contractId
    const historyByContract = new Map<number, any[]>();
    for (const h of historyRows as any[]) {
      const arr = historyByContract.get(h.contractId) ?? [];
      arr.push({
        id: h.id,
        fromStatus: h.fromStatus as ContractStatus,
        toStatus: h.toStatus as ContractStatus,
        fileUrl: h.fileUrl,
        fileName: h.fileName,
        note: h.note,
        changedByUserId: h.changedByUserId,
        createdAt: h.createdAt,
      });
      historyByContract.set(h.contractId, arr);
    }

    // Group CCs by contractId
    const ccsByContract = new Map<number, string[]>();
    for (const c of ccsRows as any[]) {
      const arr = ccsByContract.get(c.contractId) ?? [];
      arr.push(c.email);
      ccsByContract.set(c.contractId, arr);
    }

    // Merge (same as getEvents)
    const data = rows.map((r: any) => ({
      ...r,
      ccs: ccsByContract.get(r.id) ?? [],
      history: historyByContract.get(r.id) ?? [],
    }));

    const totalPages = isPaginated ? Math.max(1, Math.ceil(Number(total ?? 0) / limit)) : 1;
    return {
      data,
      totalPages,
      currentPage: safePage,
    };
  } catch (error) {
    console.error('[getContracts] - Error:', error);
    throw new Error('Recupero contratti non riuscito.');
  }
}
