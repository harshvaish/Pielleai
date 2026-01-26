import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { reviewRequests, reviews } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * GET /api/events/[id]/review-status
 * Get review request status for an event (Admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const eventId = parseInt(id);

    // Get both review requests for this event
    const requests = await database
      .select()
      .from(reviewRequests)
      .where(eq(reviewRequests.eventId, eventId));

    const artistRequest = requests.find((r: any) => r.reviewType === 'artist_reviews_venue');
    const venueRequest = requests.find((r: any) => r.reviewType === 'venue_reviews_artist');

    // Check if reviews have been submitted
    let artistReview = null;
    let venueReview = null;

    if (artistRequest) {
      artistReview = await database.query.reviews.findFirst({
        where: eq(reviews.reviewRequestId, artistRequest.id),
      });
    }

    if (venueRequest) {
      venueReview = await database.query.reviews.findFirst({
        where: eq(reviews.reviewRequestId, venueRequest.id),
      });
    }

    return NextResponse.json(
      {
        artistRequest: {
          id: artistRequest?.id || null,
          status: artistRequest?.status || null,
          emailSentAt: artistRequest?.emailSentAt || null,
          hasReview: !!artistReview,
        },
        venueRequest: {
          id: venueRequest?.id || null,
          status: venueRequest?.status || null,
          emailSentAt: venueRequest?.emailSentAt || null,
          hasReview: !!venueReview,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/events/[id]/review-status] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
