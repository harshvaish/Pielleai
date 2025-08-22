import { auth } from '@/lib/auth';
import { getArtistRangeAvailabilities } from '@/lib/data/artists/get-artist-range-availabilities';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);

  const artistSlug = url.searchParams.get('artist');
  const startDate = url.searchParams.get('start');
  const endDate = url.searchParams.get('end');

  const slugRegex = /^[0-9a-z-]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!artistSlug || !slugRegex.test(artistSlug)) {
    return NextResponse.json({ error: 'Artista mancante o non valido.' }, { status: 400 });
  }

  if (!startDate || !dateRegex.test(startDate)) {
    return NextResponse.json({ error: 'Data inizio range mancante o non valida.' }, { status: 400 });
  }

  if (!endDate || !dateRegex.test(endDate)) {
    return NextResponse.json({ error: 'Data fine range mancante o non valida.' }, { status: 400 });
  }

  try {
    const availabilities = await getArtistRangeAvailabilities({
      artistSlug,
      startDate,
      endDate,
    });
    return NextResponse.json({ availabilities }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero delle disponibilità:', error);
    return NextResponse.json({ error: 'Recupero delle disponibilità non riuscito.' }, { status: 500 });
  }
}
