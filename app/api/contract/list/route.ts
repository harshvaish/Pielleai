import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { and, desc, eq, gte, inArray, lte } from 'drizzle-orm';

import { database } from '@/lib/database/connection';
import {
  contracts,
  artists,
  venues,
  events,
} from '../../../../drizzle/schema';

import getSession from '@/lib/data/auth/get-session';

export const runtime = 'nodejs';

// ----- constants / helpers -----
const CONTRACT_STATUS = ['draft', 'queued', 'sent', 'viewed', 'signed', 'voided'] as const;
type ContractStatus = typeof CONTRACT_STATUS[number];

const StatusInput = z.union([z.literal('all'), z.enum(CONTRACT_STATUS)]);

function defaultLast7Days(): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 6); // inclusive 7-day window
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

// ----- validation -----
const filtersSchema = z.object({
  status: z.array(StatusInput).optional(), // e.g. ["sent","signed"] or ["all"]
  dateRange: z
    .object({
      start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
    .optional(),
  sort: z.enum(['asc', 'desc']).optional(), // default: desc (newest first)
});

// ----- handler -----
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // auth
    const { session, user } = await getSession();
    if (!session || !user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    // parse input
    const body = await request.json().catch(() => ({}));
    const parsed = filtersSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { status = [], dateRange, sort = 'desc' } = parsed.data;

    // compute effective range (default = last 7 days)
    const { start, end } = dateRange ?? defaultLast7Days();

    // build filters
    const whereClauses = [
      gte(contracts.contractDate, start),
      lte(contracts.contractDate, end),
    ];

    // normalize status: if includes "all" (or empty), we skip status filter
    let statusValues: readonly ContractStatus[] | null = null;
    if (status.length > 0 && !status.includes('all')) {
      statusValues = status.filter(
        (s): s is ContractStatus => (CONTRACT_STATUS as readonly string[]).includes(s),
      );
      if (statusValues.length > 0) {
        whereClauses.push(inArray(contracts.status, statusValues));
      }
    }

    // query
    const rows = await database
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
      .where(and(...whereClauses))
      .orderBy(sort === 'asc' ? contracts.createdAt : desc(contracts.createdAt));

    return NextResponse.json(
      {
        success: true,
        message: 'Contratti recuperati con successo.',
        data: rows,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[POST /api/contract/list] - Error:', error);
    return NextResponse.json(
      { success: false, message: 'Recupero contratti non riuscito.', data: null },
      { status: 500 },
    );
  }
}
