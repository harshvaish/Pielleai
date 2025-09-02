import { auth } from '@/lib/auth';
import { getCountrySubdivisions } from '@/lib/data/get-country-subdivisions';
import { ApiResponse, Subdivision } from '@/lib/types';
import { idValidation } from '@/lib/validation/_general';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Subdivision[]>>> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const url = new URL(request.url);

    const countryIdParam = url.searchParams.get('c');

    const countryId = countryIdParam ? parseInt(countryIdParam, 10) : null;

    if (!countryId) {
      return NextResponse.json(
        { success: false, message: 'Stato mancante o non valido.', data: null },
        { status: 400 },
      );
    }

    const validation = idValidation.safeParse(countryId);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const subdivisions = await getCountrySubdivisions(countryId);

    return NextResponse.json({ success: true, message: null, data: subdivisions }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero delle province:', error);
    return NextResponse.json(
      { success: false, message: 'Recupero delle province non riuscito.', data: null },
      { status: 500 },
    );
  }
}
