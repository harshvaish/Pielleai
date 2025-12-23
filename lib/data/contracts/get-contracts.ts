'server only';

import { User } from '@/lib/auth';
import { PAGINATED_TABLE_ROWS_X_PAGE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { and, count, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';

import {
  contracts,
  contractEmailCcs,
  contractHistory,
  artists,
  venues,
  events,
} from '../../../drizzle/schema';

import { artistAvailabilities } from '@/lib/database/schema';

// ----- constants -----
export const CONTRACT_STATUS = ['draft', 'queued', 'sent', 'viewed', 'signed', 'voided', 'declined'] as const;
export type ContractStatus = (typeof CONTRACT_STATUS)[number];

export type ContractListFilters = {
  currentPage?: number | null;
  status?: Array<ContractStatus | 'all'>;
  startDate?: string | null; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  sort?: 'asc' | 'desc';
};

// ✅ current month range (1st day → last day)
function defaultCurrentMonth(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

function resolveDateRange(input?: { start?: string | null; end?: string | null }) {
  const fallback = defaultCurrentMonth();
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

export async function getContracts(
  user: User,
  { currentPage, status, startDate, endDate, sort = 'desc' }: ContractListFilters,
): Promise<{
  data: any[];
  totalPages: number;
  currentPage: number;
}> {
  const limit = PAGINATED_TABLE_ROWS_X_PAGE;

  const isPaginated =
    typeof currentPage === 'number' && Number.isInteger(currentPage) && currentPage > 0;
  const safePage = isPaginated ? currentPage : 1;
  const offset = (safePage - 1) * limit;

  try {
    if (!user || user.role !== 'admin') {
      throw new Error('Non sei autorizzato.');
    }

    const { start, end } = resolveDateRange({ start: startDate ?? null, end: endDate ?? null });
    const statusValues = normalizeStatus(status);

    // ✅ NULL-safe effective date: contractDate if present, else createdAt::date
    const effectiveDate = sql`coalesce(${contracts.contractDate}, ${contracts.createdAt}::date)`;

    const filters = and(
      gte(effectiveDate, start),
      lte(effectiveDate, end),
      statusValues ? inArray(contracts.status, statusValues) : undefined,
    );

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
          tourManagerPhone: artists.tourManagerPhone,
          tourManagerName: artists.tourManagerName,
          tourManagerEmail: artists.tourManagerEmail,
          tourManagerSurname: artists.tourManagerSurname,
        },

        venue: {
          id: venues.id,
          name: venues.name,
          address: venues.address,
          status: venues.status,
          slug: venues.slug,
          avatarUrl: venues.avatarUrl,
          vatCode: venues.vatCode,
          company: venues.company,
        },

        event: {
          id: events.id,
          status: events.status,
          availabilityId: events.availabilityId,
          depositCost: events.depositCost,
          tourManagerEmail: events.tourManagerEmail,
          eventStatus: events.status,
          transportCost: events.transportationsCost,
          totalFee: events.totalCost,
          payrollConsultantEmail: events.payrollConsultantEmail,
          eventType: events.eventType,
          paymentDate: events.paymentDate,
        },

        // ✅ populated availability like getEvents
        availability: {
          id: artistAvailabilities.id,
          artistId: artistAvailabilities.artistId,
          startDate: artistAvailabilities.startDate,
          endDate: artistAvailabilities.endDate,
          status: artistAvailabilities.status,
        },
      })
      .from(contracts)
      .innerJoin(artists, eq(contracts.artistId, artists.id))
      .innerJoin(venues, eq(contracts.venueId, venues.id))
      .innerJoin(events, eq(contracts.eventId, events.id))

      // ✅ LEFT JOIN so contracts still return even if availabilityId is null
      .leftJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))

      .where(filters)
      .orderBy(sort === 'asc' ? contracts.createdAt : desc(contracts.createdAt));

    if (isPaginated) {
      // @ts-expect-error drizzle typing allows chaining here at runtime
      baseQuery = baseQuery.limit(limit).offset(offset);
    }

    const rows = await baseQuery;
    const contractIds = rows.map((r: any) => r.id);

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

      database.select({ total: count() }).from(contracts).where(filters),
    ]);

    const historyByContract = new Map<number, any[]>();
    for (const h of historyRows as any[]) {
      const arr = historyByContract.get(h.contractId) ?? [];
      arr.push({
        id: h.id,
        fromStatus: (h.fromStatus ?? null) as ContractStatus | null,
        toStatus: (h.toStatus ?? null) as ContractStatus | null,
        fileUrl: h.fileUrl ?? null,
        fileName: h.fileName ?? null,
        note: h.note ?? null,
        changedByUserId: h.changedByUserId ?? null,
        createdAt: h.createdAt,
      });
      historyByContract.set(h.contractId, arr);
    }

    const ccsByContract = new Map<number, string[]>();
    for (const c of ccsRows as any[]) {
      const arr = ccsByContract.get(c.contractId) ?? [];
      arr.push(c.email);
      ccsByContract.set(c.contractId, arr);
    }

    const data = rows.map((r: any) => ({
      ...r,
      ccs: ccsByContract.get(r.id) ?? [],
      history: historyByContract.get(r.id) ?? [],
    }));
console.log(data, "data from getContracts-----------------");
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
