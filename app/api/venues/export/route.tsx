import { NextResponse } from 'next/server';
import { unparse } from 'papaparse';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { profiles, venues } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

type CSVRow = {
  id: number;
  nome: string;
  ragione_sociale: string;
  codice_fiscale: string;
  indirizzo: string;
  tipologia: string;
  promoter: string;
  capienza: string;
  stato: string;
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

    const venuesResult = await database
      .select({
        id: venues.id,
        name: venues.name,
        company: venues.company,
        taxCode: venues.taxCode,
        address: venues.address,
        type: venues.type,
        capacity: venues.capacity,
        status: venues.status,
        managerName: profiles.name,
        managerSurname: profiles.surname,
      })
      .from(venues)
      .leftJoin(profiles, eq(venues.managerProfileId, profiles.id));

    const csvData: CSVRow[] = venuesResult.map((venue) => ({
      id: venue.id,
      nome: venue.name ?? '',
      ragione_sociale: venue.company ?? '',
      codice_fiscale: venue.taxCode ?? '',
      indirizzo: venue.address ?? '',
      tipologia: venue.type ?? '',
      promoter:
        venue.managerName && venue.managerSurname
          ? `${venue.managerName} ${venue.managerSurname}`.trim()
          : '',
      capienza: venue.capacity?.toString() ?? '',
      stato: venue.status ?? '',
    }));

    const csv = unparse(csvData, {
      header: true,
      delimiter: ';',
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="export-locali.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Errore esportazione locali:', error);
    return NextResponse.json(
      { success: false, message: 'Esportazione non riuscita.', data: null },
      { status: 500 },
    );
  }
}
