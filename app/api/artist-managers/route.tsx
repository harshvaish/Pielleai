import { auth } from '@/lib/auth';
import { getArtistManagers } from '@/lib/data/artists/get-artist-managers';
import { ApiResponse, ArtistManagerSelectData } from '@/lib/types';
import { idValidation } from '@/lib/validation/_general';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<ArtistManagerSelectData[]>>> {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const url = new URL(request.url);

    const artistIdParam = url.searchParams.get('a');
    const artistId = artistIdParam ? parseInt(artistIdParam) : null;

    if (!artistId) {
      return NextResponse.json(
        { success: false, message: 'Dati artista mancanti.', data: null },
        { status: 400 },
      );
    }

    const validation = idValidation.safeParse(artistId);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const managers = await getArtistManagers(artistId);

    return NextResponse.json({ success: true, message: null, data: managers }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero dei manager artisti:', error);

    return NextResponse.json(
      { success: false, message: 'Recupero manager artisti non riuscito.', data: null },
      { status: 500 },
    );
  }
}
