import { auth } from '@/lib/auth';
import { getArtistRangeAvailabilities } from '@/lib/data/artists/get-artist-range-availabilities';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

export async function GET(request: NextRequest) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);

  const artistSlug = url.searchParams.get('s');
  const startDate = url.searchParams.get('sd');
  const endDate = url.searchParams.get('ed');

  if (!artistSlug) {
    return NextResponse.json({ error: 'Dati artista mancanti.' }, { status: 400 });
  }

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Date di filtraggio mancanti.' }, { status: 400 });
  }

  const schema = z.object({
    artistSlug: z.uuid().nullable(),
    startDate: z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime())),
    endDate: z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime())),
  });

  const validation = schema.safeParse({ artistSlug, startDate, endDate });

  if (!validation.success) {
    return NextResponse.json({ error: 'Dati forniti non validi.' }, { status: 400 });
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
