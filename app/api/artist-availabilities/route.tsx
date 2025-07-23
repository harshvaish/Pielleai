import { getArtistAvailableAvailabilities } from '@/lib/data/artists/get-artist-available-availabilities';
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
    const availabilities = await getArtistAvailableAvailabilities({
      artistId,
    });
    return NextResponse.json({ availabilities }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero delle disponibilità:', error);
    return NextResponse.json(
      { error: 'Recupero delle disponibilità non riuscito.' },
      { status: 500 }
    );
  }
}
