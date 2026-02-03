import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { reviews, reviewRequests, events } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import getSession from '@/lib/data/auth/get-session';

/**
 * POST /api/reviews/submit/in-app
 * Submit a review in-app (authenticated, for artist/venue managers)
 * Body: { eventId, reviewType, ratings, comment }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.banned) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;
    const body = await request.json();
    const schema = z.object({
      eventId: z.number(),
      reviewType: z.enum(['artist_reviews_venue', 'venue_reviews_artist']),
      ratings: z.record(z.string(), z.number().min(1).max(5)),
      comment: z.string().max(300).optional(),
    });
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.errors }, { status: 400 });
    }
    const { eventId, reviewType, ratings, comment } = validation.data;
    // Check if already reviewed by this user for this event/type
    const [existing] = await database
      .select()
      .from(reviews)
      .where(and(eq(reviews.eventId, eventId), eq(reviews.reviewType, reviewType), eq(reviews.reviewerId, user.id)))
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Review already submitted' }, { status: 400 });
    }
    // Get event
    const [event] = await database.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    // Prepare review data
    const reviewData: Record<string, any> = {
      eventId,
      reviewType,
      reviewerId: user.id,
      reviewerEmail: user.email,
      comment: comment || null,
    };
    if (reviewType === 'artist_reviews_venue') {
      reviewData.venueId = event.venueId;
      reviewData.hospitalityRating = ratings.hospitalityRating;
      reviewData.technicalQualityRating = ratings.technicalQualityRating;
      reviewData.agreementsRespectRating = ratings.agreementsRespectRating;
      reviewData.staffTreatmentRating = ratings.staffTreatmentRating;
      reviewData.organizationalQualityRating = ratings.organizationalQualityRating;
    } else {
      reviewData.artistId = event.artistId;
      reviewData.punctualityRating = ratings.punctualityRating;
      reviewData.professionalismRating = ratings.professionalismRating;
      reviewData.audienceEngagementRating = ratings.audienceEngagementRating;
      reviewData.setlistRespectRating = ratings.setlistRespectRating;
      reviewData.logisticReadinessRating = ratings.logisticReadinessRating;
    }
    const [newReview] = await database.insert(reviews).values(reviewData as any).returning();
    return NextResponse.json({ message: 'Review submitted successfully', review: newReview }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/reviews/submit/in-app] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
