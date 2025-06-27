import { getCountrySubdivisions } from '@/lib/data/get-country-subdivisions';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const countryIdParam = url.searchParams.get('country');
  const countryId = parseInt(countryIdParam ?? '', 10);

  if (!countryIdParam || isNaN(countryId)) {
    return NextResponse.json(
      { error: 'Stato mancante o non valido' },
      { status: 400 }
    );
  }

  try {
    const subdivisions = await getCountrySubdivisions(countryId);
    return NextResponse.json({ subdivisions });
  } catch (error) {
    console.error('Errore nel recupero delle province:', error);
    return NextResponse.json(
      { error: 'Recupero delle province non riuscito' },
      { status: 500 }
    );
  }
}
