import { auth } from '@/lib/auth';
import { getArtistDateAvailabilities } from '@/lib/data/artists/get-artist-date-availabilities';
import { idValidation } from '@/lib/validation/_general';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

export async function GET(request: NextRequest) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 401 });
  }

  const url = new URL(request.url);

  const artistIdParam = url.searchParams.get('i');
  const artistSlug = url.searchParams.get('s');
  const startDate = url.searchParams.get('sd');

  const artistId = artistIdParam ? parseInt(artistIdParam) : null;

  if (!artistId && !artistSlug) {
    return NextResponse.json({ error: 'Dati artista mancanti.' }, { status: 400 });
  }

  if (!startDate) {
    return NextResponse.json({ error: 'Data di filtraggio mancante.' }, { status: 400 });
  }

  const schema = z.object({
    artistId: idValidation.nullable(),
    artistSlug: z.uuid().nullable(),
    startDate: z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime())),
  });

  const validation = schema.safeParse({ artistId, artistSlug, startDate });

  if (!validation.success) {
    return NextResponse.json({ error: 'Dati forniti non validi.' }, { status: 400 });
  }

  try {
    const availabilities = await getArtistDateAvailabilities({
      artistId,
      artistSlug,
      startDate,
    });
    return NextResponse.json({ availabilities }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero delle disponibilità:', error);
    return NextResponse.json({ error: 'Recupero delle disponibilità non riuscito.' }, { status: 500 });
  }
}
