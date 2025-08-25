import { auth } from '@/lib/auth';
import { getArtistManagers } from '@/lib/data/artists/get-artist-managers';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);

  const artistIdParam = url.searchParams.get('artist');
  const artistId = Number(artistIdParam);

  if (isNaN(artistId) || artistId === null) {
    return NextResponse.json({ error: 'Artista mancante o non valido.' }, { status: 400 });
  }

  try {
    const managers = await getArtistManagers(artistId);
    return NextResponse.json({ managers }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero dei manager artista:', error);
    return NextResponse.json({ error: 'Recupero dei manager artista non riuscito.' }, { status: 500 });
  }
}
