import { getArtistAvailabilitiesFromDate } from '@/lib/data/artists/get-artist-availabilities-from-date';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const artistSlug = url.searchParams.get('artist');
  const date = url.searchParams.get('date');

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!artistSlug) {
    return NextResponse.json(
      { error: 'Artista mancante o non valido.' },
      { status: 400 }
    );
  }

  if (!date || !dateRegex.test(date)) {
    return NextResponse.json(
      { error: 'Data mancante o non valida.' },
      { status: 400 }
    );
  }

  try {
    const availabilities = await getArtistAvailabilitiesFromDate({
      artistSlug,
      date,
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
