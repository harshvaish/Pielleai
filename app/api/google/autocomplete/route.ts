import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  input: z.string().min(1),
  countryCode: z.string().trim().min(0).optional(),
  sessionToken: z.string().trim().min(0).optional(),
});

type Prediction = {
  placeId: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

type CacheEntry = { expiresAt: number; value: Prediction[] };
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const cache = new Map<string, CacheEntry>();

function cacheKey(input: string, countryCode?: string) {
  return `${(countryCode || '').toLowerCase()}::${input.trim().toLowerCase()}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      input: searchParams.get('input') ?? '',
      countryCode: searchParams.get('countryCode') ?? undefined,
      sessionToken: searchParams.get('sessionToken') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input.', data: null },
        { status: 400 },
      );
    }

    const input = parsed.data.input.trim();
    if (input.length < 3) {
      return NextResponse.json({ success: true, message: null, data: [] satisfies Prediction[] });
    }

    const key = cacheKey(input, parsed.data.countryCode);
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ success: true, message: null, data: cached.value });
    }

    // Use a server-side key. If you only have one, reuse GOOGLE_GEOCODING_API_KEY.
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_GEOCODING_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'Missing GOOGLE_PLACES_API_KEY.', data: null },
        { status: 500 },
      );
    }

    const countryCode = parsed.data.countryCode?.trim();
    const sessionToken = parsed.data.sessionToken?.trim();

    const body: Record<string, unknown> = {
      input,
      languageCode: 'it',
      regionCode: 'IT',
    };

    // Try to restrict results to a country when provided.
    if (countryCode) {
      body.includedRegionCodes = [countryCode.toUpperCase()];
    }

    if (sessionToken) body.sessionToken = sessionToken;

    const resp = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Keep payload small.
        'X-Goog-FieldMask':
          [
            'suggestions.placePrediction.placeId',
            'suggestions.placePrediction.text.text',
            'suggestions.placePrediction.structuredFormat.mainText.text',
            'suggestions.placePrediction.structuredFormat.secondaryText.text',
          ].join(','),
      },
      body: JSON.stringify(body),
      // Reduce cost spikes from repeated keystrokes.
      // (We also cache responses in-memory for a short TTL.)
    });

    const payload = await resp.json().catch(() => null);
    if (!resp.ok) {
      const message =
        payload?.error?.message ||
        payload?.message ||
        `Places Autocomplete failed (${resp.status}).`;
      return NextResponse.json({ success: false, message, data: null }, { status: 502 });
    }

    const suggestions = Array.isArray(payload?.suggestions) ? payload.suggestions : [];
    const predictions: Prediction[] = [];

    for (const s of suggestions) {
      const pp = s?.placePrediction;
      if (!pp?.placeId) continue;
      const description = pp?.text?.text || '';
      const main = pp?.structuredFormat?.mainText?.text;
      const secondary = pp?.structuredFormat?.secondaryText?.text;
      predictions.push({
        placeId: pp.placeId,
        description,
        structured_formatting: {
          ...(main ? { main_text: main } : {}),
          ...(secondary ? { secondary_text: secondary } : {}),
        },
      });
    }

    cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value: predictions });
    // Simple cache size cap (avoid unbounded growth in long-lived processes).
    if (cache.size > 500) {
      const firstKey = cache.keys().next().value as string | undefined;
      if (firstKey) cache.delete(firstKey);
    }

    return NextResponse.json({ success: true, message: null, data: predictions });
  } catch (error) {
    console.error('[google/autocomplete] error:', error);
    return NextResponse.json(
      { success: false, message: 'Autocomplete failed.', data: null },
      { status: 500 },
    );
  }
}

