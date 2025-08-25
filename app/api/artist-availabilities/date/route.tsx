import { auth } from '@/lib/auth';
import { getArtistDateAvailabilities } from '@/lib/data/artists/get-artist-date-availabilities';
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

  const artistId = url.searchParams.get('i');
  const artistSlug = url.searchParams.get('s');
  const date = url.searchParams.get('date');

  const idRegex = /^[0-9]+$/;
  const slugRegex = /^[0-9a-z-]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (artistId && !idRegex.test(artistId)) {
    return NextResponse.json({ error: 'Artista mancante o non valido. (i)' }, { status: 400 });
  }

  if (artistSlug && !slugRegex.test(artistSlug)) {
    return NextResponse.json({ error: 'Artista mancante o non valido. (s)' }, { status: 400 });
  }

  if (!date || !dateRegex.test(date)) {
    return NextResponse.json({ error: 'Data mancante o non valida.' }, { status: 400 });
  }

  try {
    const availabilities = await getArtistDateAvailabilities({
      artistId,
      artistSlug,
      date,
    });
    return NextResponse.json({ availabilities }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero delle disponibilità:', error);
    return NextResponse.json({ error: 'Recupero delle disponibilità non riuscito.' }, { status: 500 });
  }
}
