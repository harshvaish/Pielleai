'server only';

import { eq, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

import { supabaseServerClient } from '@/lib/supabase-server-client';
import { database } from '@/lib/database/connection';
import type { ArtistSelectData, VenueBadgeData } from '@/lib/types';
import { generateEventTitle } from '@/lib/utils/generate-event-title';

import { events, artists, venues, artistAvailabilities, profiles } from '../../../drizzle/schema';

export type OtherDocument = {
  name: string;
  url: string;
  uploadedAt: string | null;
  event: {
    id: number;
    title: string;
    status: string;
    hasConflict: boolean;
    availability: {
      startDate: string | null;
      endDate: string | null;
    } | null;
    artist: ArtistSelectData;
    venue: VenueBadgeData;
    artistManager: {
      id: number;
      name: string;
      surname: string;
      avatarUrl: string | null;
    } | null;
    tourManagerEmail: string | null;
    payrollConsultantEmail: string | null;
  };
};

const formatDocumentDate = (value?: string | null): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const stripTimestampPrefix = (value: string): string => value.replace(/^\d+-\d+-/, '');
const parseEventId = (value: string): number | null => {
  const match = /^(\d+)-\d+-/.exec(value);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
};

export async function getOtherDocuments(limit = 50): Promise<OtherDocument[]> {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME;
  if (!bucket) return [];

  const { data, error } = await supabaseServerClient.storage
    .from(bucket)
    .list('other-documents', {
      limit,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error || !data) {
    return [];
  }

  const seen = new Set<string>();
  const rawDocs: Array<{
    name: string;
    url: string;
    uploadedAt: string | null;
    eventId: number;
  }> = [];

  for (const item of data) {
    if (!item.name) continue;
    if (!item.metadata || !item.metadata.size) continue;
    if (seen.has(item.name)) continue;
    const eventId = parseEventId(item.name);
    if (!eventId) continue;
    seen.add(item.name);

    const path = `other-documents/${item.name}`;
    const { data: urlData } = supabaseServerClient.storage.from(bucket).getPublicUrl(path);
    const displayName = stripTimestampPrefix(item.name);
    const uploadedAt = formatDocumentDate(item.created_at ?? item.updated_at ?? null);
    rawDocs.push({
      name: displayName,
      url: urlData.publicUrl,
      uploadedAt,
      eventId,
    });
  }

  if (!rawDocs.length) return [];

  const eventIds = Array.from(new Set(rawDocs.map((doc) => doc.eventId)));
  const artistManagerProfile = alias(profiles, 'artistManagerProfile');

  const rows = await database
    .select({
      id: events.id,
      title: events.title,
      status: events.status,
      hasConflict: events.hasConflict,
      tourManagerEmail: events.tourManagerEmail,
      payrollConsultantEmail: events.payrollConsultantEmail,
      availability: {
        startDate: artistAvailabilities.startDate,
        endDate: artistAvailabilities.endDate,
      },
      artist: {
        id: artists.id,
        name: artists.name,
        surname: artists.surname,
        stageName: artists.stageName,
        avatarUrl: artists.avatarUrl,
        slug: artists.slug,
        status: artists.status,
        tourManagerName: artists.tourManagerName,
        tourManagerSurname: artists.tourManagerSurname,
        tourManagerEmail: artists.tourManagerEmail,
      },
      venue: {
        id: venues.id,
        name: venues.name,
        slug: venues.slug,
        status: venues.status,
        avatarUrl: venues.avatarUrl,
      },
      artistManager: {
        id: artistManagerProfile.id,
        name: artistManagerProfile.name,
        surname: artistManagerProfile.surname,
        avatarUrl: artistManagerProfile.avatarUrl,
      },
    })
    .from(events)
    .innerJoin(artists, eq(events.artistId, artists.id))
    .innerJoin(venues, eq(events.venueId, venues.id))
    .leftJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
    .leftJoin(artistManagerProfile, eq(events.artistManagerProfileId, artistManagerProfile.id))
    .where(inArray(events.id, eventIds));

  const eventMap = new Map<number, OtherDocument['event']>();
  for (const row of rows) {
    const availability = row.availability?.startDate
      ? {
          startDate: row.availability.startDate,
          endDate: row.availability.endDate,
        }
      : null;
    const artistLabel =
      row.artist.stageName?.trim() ||
      `${row.artist.name} ${row.artist.surname}`.trim();
    const title =
      row.title?.trim() ||
      (availability?.startDate
        ? generateEventTitle(
            artistLabel,
            row.venue.name,
            new Date(availability.startDate),
            availability.endDate ? new Date(availability.endDate) : new Date(availability.startDate),
          )
        : `Evento #${row.id}`);

    eventMap.set(row.id, {
      id: row.id,
      title,
      status: row.status,
      hasConflict: row.hasConflict ?? false,
      availability,
      artist: {
        ...row.artist,
        status: row.artist.status as ArtistSelectData['status'],
      },
      venue: {
        ...row.venue,
        status: row.venue.status as VenueBadgeData['status'],
      },
      artistManager: row.artistManager?.id ? row.artistManager : null,
      tourManagerEmail: row.tourManagerEmail ?? null,
      payrollConsultantEmail: row.payrollConsultantEmail ?? null,
    });
  }

  return rawDocs
    .map((doc) => {
      const event = eventMap.get(doc.eventId);
      if (!event) return null;
      return {
        name: doc.name,
        url: doc.url,
        uploadedAt: doc.uploadedAt,
        event,
      };
    })
    .filter(Boolean) as OtherDocument[];
}
