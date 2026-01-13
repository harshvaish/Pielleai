import { NextResponse } from 'next/server';
import { unparse } from 'papaparse';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { artistZones, artists, managerArtists, profiles, zones } from '@/lib/database/schema';
import { eq, inArray } from 'drizzle-orm';

type CSVRow = {
  id: number;
  nome: string;
  cognome: string;
  nome_arte: string;
  email: string;
  telefono: string;
  stato: string;
  manager: string;
  aree_interesse: string;
};

export async function GET(): Promise<NextResponse> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const artistsResult = await database
      .select({
        id: artists.id,
        name: artists.name,
        surname: artists.surname,
        stageName: artists.stageName,
        email: artists.email,
        phone: artists.phone,
        status: artists.status,
      })
      .from(artists);

    const artistIds = artistsResult.map((artist) => artist.id);

    const [managersResult, zonesResult] = await Promise.all([
      artistIds.length
        ? database
            .select({
              artistId: managerArtists.artistId,
              name: profiles.name,
              surname: profiles.surname,
            })
            .from(managerArtists)
            .innerJoin(profiles, eq(managerArtists.managerProfileId, profiles.id))
            .where(inArray(managerArtists.artistId, artistIds))
        : Promise.resolve([]),
      artistIds.length
        ? database
            .select({
              artistId: artistZones.artistId,
              name: zones.name,
            })
            .from(artistZones)
            .innerJoin(zones, eq(artistZones.zoneId, zones.id))
            .where(inArray(artistZones.artistId, artistIds))
        : Promise.resolve([]),
    ]);

    const managersByArtist = new Map<number, string[]>();
    for (const row of managersResult) {
      const label = `${row.name} ${row.surname}`.trim();
      const existing = managersByArtist.get(row.artistId) ?? [];
      existing.push(label);
      managersByArtist.set(row.artistId, existing);
    }

    const zonesByArtist = new Map<number, string[]>();
    for (const row of zonesResult) {
      const existing = zonesByArtist.get(row.artistId) ?? [];
      existing.push(row.name);
      zonesByArtist.set(row.artistId, existing);
    }

    const csvData: CSVRow[] = artistsResult.map((artist) => ({
      id: artist.id,
      nome: artist.name,
      cognome: artist.surname,
      nome_arte: artist.stageName ?? '',
      email: artist.email ?? '',
      telefono: artist.phone ?? '',
      stato: artist.status ?? '',
      manager: (managersByArtist.get(artist.id) ?? []).join(', '),
      aree_interesse: (zonesByArtist.get(artist.id) ?? []).join(', '),
    }));

    const csv = unparse(csvData, {
      header: true,
      delimiter: ';',
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="export-artisti.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Errore esportazione artisti:', error);
    return NextResponse.json(
      { success: false, message: 'Esportazione non riuscita.', data: null },
      { status: 500 },
    );
  }
}
