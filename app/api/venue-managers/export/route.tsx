import { NextResponse } from 'next/server';
import { unparse } from 'papaparse';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { profiles, users, venues } from '@/lib/database/schema';
import { and, eq, inArray, isNotNull } from 'drizzle-orm';

type CSVRow = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  stato: string;
  locali: string;
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
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(and(eq(users.role, 'venue-manager'), inArray(users.status, ['active', 'disabled'])));

    const managerProfileIds = managers.map((manager) => manager.profileId);
    const venuesResult = managerProfileIds.length
      ? await database
          .select({
            managerId: venues.managerProfileId,
            name: venues.name,
          })
          .from(venues)
          .where(
            and(
              inArray(venues.managerProfileId, managerProfileIds),
              isNotNull(venues.managerProfileId),
            ),
          )
      : [];

    const venuesByManager = new Map<number, string[]>();
    for (const row of venuesResult) {
      if (!row.managerId) continue;
      const existing = venuesByManager.get(row.managerId) ?? [];
      existing.push(row.name);
      venuesByManager.set(row.managerId, existing);
    }

    const csvData: CSVRow[] = managers.map((manager) => ({
      id: manager.id,
      nome: manager.name,
      cognome: manager.surname,
      email: manager.email ?? '',
      telefono: manager.phone ?? '',
      stato: manager.status ?? '',
      locali: (venuesByManager.get(manager.profileId) ?? []).join(', '),
    }));

    const csv = unparse(csvData, {
      header: true,
      delimiter: ';',
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="export-promoter-locali.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Errore esportazione promoter locali:', error);
    return NextResponse.json(
      { success: false, message: 'Esportazione non riuscita.', data: null },
      { status: 500 },
    );
  }
}
