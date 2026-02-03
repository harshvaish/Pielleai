import { auth } from '@/lib/auth';
import { checkArtistBlacklist } from '@/lib/data/artists/check-artist-blacklist';
import { ApiResponse, ArtistBlacklistCheck } from '@/lib/types';
import { idValidation } from '@/lib/validation/_general';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<ArtistBlacklistCheck>>> {
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

    const artistParam = url.searchParams.get('a');
    const venueParam = url.searchParams.get('v');

    const artistId = artistParam ? parseInt(artistParam, 10) : null;
    const venueId = venueParam ? parseInt(venueParam, 10) : null;

    if (!artistId || !venueId) {
      return NextResponse.json(
        { success: false, message: 'Dati mancanti.', data: null },
        { status: 400 },
      );
    }

    const artistValidation = idValidation.safeParse(artistId);
    const venueValidation = idValidation.safeParse(venueId);

    if (!artistValidation.success || !venueValidation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const result = await checkArtistBlacklist(artistId, venueId);

    return NextResponse.json({ success: true, message: null, data: result }, { status: 200 });
  } catch (error) {
    console.error('Errore nel controllo blacklist artista:', error);

    return NextResponse.json(
      { success: false, message: 'Controllo blacklist non riuscito.', data: null },
      { status: 500 },
    );
  }
}
