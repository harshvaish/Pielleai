import { NextResponse } from 'next/server';
import { unparse } from 'papaparse';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { professionals } from '@/lib/database/schema';

type CSVRow = {
  id: number;
  nome_completo: string;
  ruolo: string;
  descrizione_ruolo: string;
  email: string;
  telefono: string;
  competenze: string;
  creato_il: string;
  aggiornato_il: string;
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

    const rows = await database.select({
      id: professionals.id,
      fullName: professionals.fullName,
      role: professionals.role,
      roleDescription: professionals.roleDescription,
      email: professionals.email,
      phone: professionals.phone,
      competencies: professionals.competencies,
      createdAt: professionals.createdAt,
      updatedAt: professionals.updatedAt,
    }).from(professionals);

    const csvData: CSVRow[] = rows.map((row) => ({
      id: row.id,
      nome_completo: row.fullName ?? '',
      ruolo: row.role ?? '',
      descrizione_ruolo: row.roleDescription ?? '',
      email: row.email ?? '',
      telefono: row.phone ?? '',
      competenze: row.competencies ?? '',
      creato_il: row.createdAt ? new Date(row.createdAt).toISOString() : '',
      aggiornato_il: row.updatedAt ? new Date(row.updatedAt).toISOString() : '',
    }));

    const csv = unparse(csvData, {
      header: true,
      delimiter: ';',
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="export-professionisti.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Errore esportazione professionisti:', error);
    return NextResponse.json(
      { success: false, message: 'Esportazione non riuscita.', data: null },
      { status: 500 },
    );
  }
}
