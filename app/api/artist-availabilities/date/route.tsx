import { auth } from '@/lib/auth';
import { getArtistDateAvailabilities } from '@/lib/data/artists/get-artist-date-availabilities';
import { ApiResponse, ArtistAvailability } from '@/lib/types';
import { idValidation, stringDateValidation } from '@/lib/validation/_general';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<ArtistAvailability[]>>> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const url = new URL(request.url);

    const artistIdParam = url.searchParams.get('i');
    const artistSlugParam = url.searchParams.get('s');
    const startDateParam = url.searchParams.get('sd');

    const artistId = artistIdParam ? parseInt(artistIdParam) : null;

    if (!artistId && !artistSlugParam) {
      return NextResponse.json(
        { success: false, message: 'Dati artista mancanti.', data: null },
        { status: 400 },
      );
    }

    if (!startDateParam) {
      return NextResponse.json(
        { success: false, message: 'Data di filtraggio mancante.', data: null },
        { status: 400 },
      );
    }

    const schema = z.object({
      artistId: idValidation.nullable(),
      artistSlug: z.uuid().nullable(),
      startDate: stringDateValidation,
    });

    const validation = schema.safeParse({
      artistId,
      artistSlug: artistSlugParam,
      startDate: startDateParam,
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const availabilities = await getArtistDateAvailabilities({
      artistId,
      artistSlug: artistSlugParam,
      startDate: startDateParam,
    });

    return NextResponse.json(
      { success: true, message: null, data: availabilities },
      { status: 200 },
    );
  } catch (error) {
    console.error('Errore nel recupero delle disponibilità:', error);
    return NextResponse.json(
      { success: false, message: 'Recupero delle disponibilità non riuscito.', data: null },
      { status: 500 },
    );
  }
}
