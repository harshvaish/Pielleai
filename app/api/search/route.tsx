import { auth } from '@/lib/auth';
import { getSearchItems } from '@/lib/data/get-search-items';
import { ApiResponse, SearchItem } from '@/lib/types';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

const searchTextValidation = z
  .string()
  .trim()
  .min(1, 'Testo ricerca mancante.') // empty after trim
  .max(100, 'Il testo di ricerca è troppo lungo (max 100).')
  // disallow control chars
  .refine((s) => !/[\u0000-\u001F\u007F]/.test(s), 'Caratteri non consentiti.')
  // allow only letters/numbers/spaces and a small safe set of punctuation
  .regex(/^[\p{L}\p{N}\s.,'’_-]+$/u, 'Caratteri non consentiti.')
  .transform((s) => s.normalize('NFC')) // normalize unicode
  // extra guard against symbols often used in injections
  .refine((s) => !/[<>`$\\{};|]/.test(s), 'Caratteri potenzialmente pericolosi non consentiti.');

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<SearchItem[]>>> {
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
    const valueParam = url.searchParams.get('v');

    if (!valueParam) {
      return NextResponse.json(
        { success: false, message: 'Valore ricercato non presente.', data: null },
        { status: 400 },
      );
    }

    const validation = searchTextValidation.safeParse(valueParam);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const searchText = validation.data;

    const items = await getSearchItems(searchText);

    return NextResponse.json({ success: true, message: null, data: items }, { status: 200 });
  } catch (error) {
    console.error('Errore nella ricerca degli items:', error);
    return NextResponse.json(
      { success: false, message: 'Recupero suggerimenti non riuscito.', data: null },
      { status: 500 },
    );
  }
}
