'server only';

import { eq, inArray } from 'drizzle-orm';

import { supabaseServerClient } from '@/lib/supabase-server-client';
import { database } from '@/lib/database/connection';
import type { ArtistManagerSelectData } from '@/lib/types';
import { artists, managerArtists, profiles, users } from '@/lib/database/schema';

export type ArtistOtherDocument = {
  name: string;
  url: string;
  uploadedAt: string | null;
  artist: {
    id: number;
    slug: string;
    status: 'active' | 'waiting-for-approval' | 'disabled' | 'banned';
    avatarUrl: string;
    name: string;
    surname: string;
    stageName: string;
    email: string;
    managers: ArtistManagerSelectData[];
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
const parseArtistId = (value: string): number | null => {
  const match = /^(\d+)-\d+-/.exec(value);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
};

export async function getArtistOtherDocuments(limit = 50): Promise<ArtistOtherDocument[]> {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME;
  if (!bucket) return [];

  const { data, error } = await supabaseServerClient.storage
    .from(bucket)
    .list('artist-documents', {
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
    artistId: number;
  }> = [];

  for (const item of data) {
    if (!item.name) continue;
    if (!item.metadata || !item.metadata.size) continue;
    if (seen.has(item.name)) continue;
    const artistId = parseArtistId(item.name);
    if (!artistId) continue;
    seen.add(item.name);

    const path = `artist-documents/${item.name}`;
    const { data: urlData } = supabaseServerClient.storage.from(bucket).getPublicUrl(path);
    const displayName = stripTimestampPrefix(item.name);
    const uploadedAt = formatDocumentDate(item.created_at ?? item.updated_at ?? null);
    rawDocs.push({
      name: displayName,
      url: urlData.publicUrl,
      uploadedAt,
      artistId,
    });
  }

  if (!rawDocs.length) return [];

  const artistIds = Array.from(new Set(rawDocs.map((doc) => doc.artistId)));
  const artistRows = await database
    .select({
      id: artists.id,
      slug: artists.slug,
      status: artists.status,
      avatarUrl: artists.avatarUrl,
      name: artists.name,
      surname: artists.surname,
      stageName: artists.stageName,
      email: artists.email,
    })
    .from(artists)
    .where(inArray(artists.id, artistIds));

  const managersRows = await database
    .select({
      artistId: managerArtists.artistId,
      id: profiles.userId,
      profileId: profiles.id,
      avatarUrl: profiles.avatarUrl,
      name: profiles.name,
      surname: profiles.surname,
      status: users.status,
    })
    .from(managerArtists)
    .innerJoin(profiles, eq(managerArtists.managerProfileId, profiles.id))
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(inArray(managerArtists.artistId, artistIds));

  const managersByArtist: Record<number, ArtistManagerSelectData[]> = {};

  for (const row of managersRows) {
    if (!managersByArtist[row.artistId]) {
      managersByArtist[row.artistId] = [];
    }
    managersByArtist[row.artistId].push({
      id: row.id,
      profileId: row.profileId,
      avatarUrl: row.avatarUrl,
      name: row.name,
      surname: row.surname,
      status: row.status,
    });
  }

  const artistMap = new Map<number, ArtistOtherDocument['artist']>();
  for (const row of artistRows) {
    artistMap.set(row.id, {
      ...row,
      status: row.status as ArtistOtherDocument['artist']['status'],
      managers: managersByArtist[row.id] || [],
    });
  }

  return rawDocs
    .map((doc) => {
      const artist = artistMap.get(doc.artistId);
      if (!artist) return null;
      return {
        name: doc.name,
        url: doc.url,
        uploadedAt: doc.uploadedAt,
        artist,
      };
    })
    .filter(Boolean) as ArtistOtherDocument[];
}
