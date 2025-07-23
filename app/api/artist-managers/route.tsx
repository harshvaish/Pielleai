import { getArtistManagers } from '@/lib/data/artists/get-artist-managers';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const artistIdParam = url.searchParams.get('artist');
  const artistId = Number(artistIdParam);

  if (isNaN(artistId) || artistId === null) {
    return NextResponse.json(
      { error: 'Artista mancante o non valido.' },
      { status: 400 }
    );
  }

  try {
    const managers = await getArtistManagers(artistId);
    return NextResponse.json({ managers }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero dei manager artista:', error);
    return NextResponse.json(
      { error: 'Recupero dei manager artista non riuscito.' },
      { status: 500 }
    );
  }
}
