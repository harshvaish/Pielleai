import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { reviews, reviewRequests, events, artists, venues } from '@/drizzle/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * GET /api/reviews
 * Fetch all reviews (Admin only)
 * Query params:
 * - eventId: Filter by event ID
 * - artistId: Filter by artist ID
 * - venueId: Filter by venue ID
 * - includeDeleted: Include deleted reviews (default: false)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const artistId = searchParams.get('artistId');
    const venueId = searchParams.get('venueId');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    let conditions = [];
    
    if (eventId) {
      conditions.push(eq(reviews.eventId, parseInt(eventId)));
    }
    
    if (artistId) {
      conditions.push(eq(reviews.artistId, parseInt(artistId)));
    }
    
    if (venueId) {
      conditions.push(eq(reviews.venueId, parseInt(venueId)));
    }

    if (!includeDeleted) {
      conditions.push(isNull(reviews.deletedAt));
    }

    const reviewsList = await database
      .select({
        review: reviews,
        event: events,
        artist: artists,
        venue: venues,
      })
      .from(reviews)
      .leftJoin(events, eq(reviews.eventId, events.id))
      .leftJoin(artists, eq(reviews.artistId, artists.id))
      .leftJoin(venues, eq(reviews.venueId, venues.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ reviews: reviewsList }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/reviews] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
