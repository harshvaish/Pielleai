import { auth } from '@/lib/auth';
import { getArtistRangeAvailabilities } from '@/lib/data/artists/get-artist-range-availabilities';
import { ApiResponse, ArtistAvailability } from '@/lib/types';
import { stringDateValidation } from '@/lib/validation/_general';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<ArtistAvailability[]>>> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const url = new URL(request.url);

    const artistSlug = url.searchParams.get('s');
    const artistIdParam = url.searchParams.get('i');
    const startDate = url.searchParams.get('sd');
    const endDate = url.searchParams.get('ed');

    const artistId = artistIdParam ? parseInt(artistIdParam) : null;

    if (!artistSlug && !artistId) {
      return NextResponse.json(
        { success: false, message: 'Dati artista mancanti.', data: null },
        { status: 400 },
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'Date di filtraggio mancanti.', data: null },
        { status: 400 },
      );
    }

    const schema = z.object({
      artistSlug: z.uuid().nullable().optional(),
      artistId: z.number().int().positive().nullable().optional(),
      startDate: stringDateValidation,
      endDate: stringDateValidation,
    });

    const validation = schema.safeParse({
      artistSlug: artistSlug ?? null,
      artistId,
      startDate,
      endDate,
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const availabilities = await getArtistRangeAvailabilities({
      artistSlug: artistSlug ?? undefined,
      artistId,
      startDate,
      endDate,
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
