import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { reviews } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/data/auth/get-session';

/**
 * GET /api/reviews/submit/in-app/check?eventId=...&reviewType=...
 * Checks if the current user has already submitted a review for this event and type
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.banned) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;
    const { searchParams } = new URL(request.url);
    const eventId = Number(searchParams.get('eventId'));
    const reviewType = searchParams.get('reviewType');
    if (!eventId || !reviewType) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    const [existing] = await database
      .select()
      .from(reviews)
      .where(and(eq(reviews.eventId, eventId), eq(reviews.reviewType, reviewType), eq(reviews.reviewerId, user.id)))
      .limit(1);
    return NextResponse.json({ alreadyReviewed: !!existing }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/reviews/submit/in-app/check] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
