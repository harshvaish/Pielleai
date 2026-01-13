import { NextResponse } from 'next/server';
import { unparse } from 'papaparse';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { artists, managerArtists, profiles, users } from '@/lib/database/schema';
import { and, eq, inArray } from 'drizzle-orm';

type CSVRow = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  stato: string;
  ragione_sociale: string;
  artisti: string;
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

    const managers = await database
      .select({
        id: users.id,
        profileId: profiles.id,
        status: users.status,
        name: profiles.name,
        surname: profiles.surname,
        email: users.email,
        phone: profiles.phone,
        company: profiles.company,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(and(eq(users.role, 'artist-manager'), inArray(users.status, ['active', 'disabled'])));

    const managerProfileIds = managers.map((manager) => manager.profileId);
    const artistsResult = managerProfileIds.length
      ? await database
          .select({
            managerId: managerArtists.managerProfileId,
            name: artists.name,
            surname: artists.surname,
            stageName: artists.stageName,
          })
          .from(managerArtists)
          .innerJoin(artists, eq(managerArtists.artistId, artists.id))
          .where(inArray(managerArtists.managerProfileId, managerProfileIds))
      : [];

    const artistsByManager = new Map<number, string[]>();
    for (const row of artistsResult) {
      const label = row.stageName || `${row.name} ${row.surname}`.trim();
      const existing = artistsByManager.get(row.managerId) ?? [];
      existing.push(label);
      artistsByManager.set(row.managerId, existing);
    }

    const csvData: CSVRow[] = managers.map((manager) => ({
      id: manager.id,
      nome: manager.name,
      cognome: manager.surname,
      email: manager.email,
      telefono: manager.phone ?? '',
      stato: manager.status ?? '',
      ragione_sociale: manager.company ?? '',
      artisti: (artistsByManager.get(manager.profileId) ?? []).join(', '),
    }));

    const csv = unparse(csvData, {
      header: true,
      delimiter: ';',
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="export-manager-artisti.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Errore esportazione manager artisti:', error);
    return NextResponse.json(
      { success: false, message: 'Esportazione non riuscita.', data: null },
      { status: 500 },
    );
  }
}
