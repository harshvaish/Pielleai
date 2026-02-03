import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedArtists } from '@/lib/data/artists/get-recommended-artists';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const venueIdParam = searchParams.get('venueId');
  const startDate = searchParams.get('sd');
  const endDate = searchParams.get('ed');
  const budgetParam = searchParams.get('budget');
  const limitParam = searchParams.get('limit');
  const debugParam = searchParams.get('debug');

  if (!venueIdParam || !startDate || !endDate) {
    return NextResponse.json(
      { success: false, message: 'Parametri mancanti.' },
      { status: 400 },
    );
  }

  const venueId = Number(venueIdParam);
  if (Number.isNaN(venueId)) {
    return NextResponse.json(
      { success: false, message: 'Locale non valido.' },
      { status: 400 },
    );
  }

  const budget =
    budgetParam === null || budgetParam === undefined || budgetParam.length === 0
      ? null
      : Number(budgetParam);

  const limit =
    limitParam === null || limitParam === undefined || limitParam.length === 0
      ? undefined
      : Number(limitParam);
  const includeDebug = debugParam === '1' || debugParam === 'true';

  try {
    const result = await getRecommendedArtists({
      venueId,
      startDate,
      endDate,
      budget,
      limit,
      includeDebug,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      ...(includeDebug ? { debug: result.debug } : {}),
    });
  } catch (error) {
    console.error('[GET /api/artists/recommended] - Error:', error);
    return NextResponse.json(
      { success: false, message: 'Recupero artisti consigliati non riuscito.' },
      { status: 500 },
    );
  }
}
