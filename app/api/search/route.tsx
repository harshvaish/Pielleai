import { auth } from '@/lib/auth';
import { getSearchItems } from '@/lib/data/get-search-items';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

// Strict schema for the query param `value`
const SearchSchema = z.object({
  value: z
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
    .refine((s) => !/[<>`$\\{};|]/.test(s), 'Caratteri potenzialmente pericolosi non consentiti.'),
});

export async function GET(request: NextRequest) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);

  // Validate the query using zod
  const check = SearchSchema.safeParse({
    value: url.searchParams.get('value') ?? '',
  });

  if (!check.success) {
    return NextResponse.json({ error: check.error.message }, { status: 400 });
  }

  const { value: searchText } = check.data;

  try {
    const items = await getSearchItems(searchText);
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Errore nella ricerca degli items:', error);
    return NextResponse.json({ error: 'Recupero degli item per la ricerca non riuscito.' }, { status: 500 });
  }
}
