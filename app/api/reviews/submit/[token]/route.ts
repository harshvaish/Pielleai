import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { reviews, reviewRequests, events, artists, venues } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

/**
 * GET /api/reviews/submit/[token]
 * Get review request details by token (Public for reviewers)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Use simple select instead of query builder to avoid relation issues
    const [reviewRequest] = await database
      .select()
      .from(reviewRequests)
      .where(eq(reviewRequests.reviewToken, token))
      .limit(1);

    if (!reviewRequest) {
      return NextResponse.json(
        { error: 'Invalid or expired review link' },
        { status: 404 }
      );
    }

    // Check if review already submitted
    const [existingReview] = await database
      .select()
      .from(reviews)
      .where(eq(reviews.reviewRequestId, reviewRequest.id))
      .limit(1);

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already submitted', submitted: true },
        { status: 400 }
      );
    }

    // Get event details
    const [event] = await database
      .select()
      .from(events)
      .where(eq(events.id, reviewRequest.eventId))
      .limit(1);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get artist and venue
    const [artist] = event.artistId
      ? await database.select().from(artists).where(eq(artists.id, event.artistId)).limit(1)
      : [null];

    const [venue] = event.venueId
      ? await database.select().from(venues).where(eq(venues.id, event.venueId)).limit(1)
      : [null];

    const eventWithDetails = {
      ...event,
      artist,
      venue,
    };

    return NextResponse.json(
      {
        reviewRequest: {
          id: reviewRequest.id,
          eventId: reviewRequest.eventId,
          reviewType: reviewRequest.reviewType,
          event: eventWithDetails,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/reviews/submit/[token]] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews/submit/[token]
 * Submit a review (Public for reviewers)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();

    // Find review request
    const [reviewRequest] = await database
      .select()
      .from(reviewRequests)
      .where(eq(reviewRequests.reviewToken, token))
      .limit(1);

    if (!reviewRequest) {
      return NextResponse.json(
        { error: 'Invalid or expired review link' },
        { status: 404 }
      );
    }

    // Get event
    const [event] = await database
      .select()
      .from(events)
      .where(eq(events.id, reviewRequest.eventId))
      .limit(1);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if review already submitted
    const [existingReview] = await database
      .select()
      .from(reviews)
      .where(eq(reviews.reviewRequestId, reviewRequest.id))
      .limit(1);

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already submitted' },
        { status: 400 }
      );
    }

    // Validate based on review type
    const artistReviewsVenueSchema = z.object({
      hospitalityRating: z.number().min(1).max(5),
      technicalQualityRating: z.number().min(1).max(5),
      agreementsRespectRating: z.number().min(1).max(5),
      staffTreatmentRating: z.number().min(1).max(5),
      organizationalQualityRating: z.number().min(1).max(5),
      comment: z.string().max(300).optional(),
    });

    const venueReviewsArtistSchema = z.object({
      punctualityRating: z.number().min(1).max(5),
      professionalismRating: z.number().min(1).max(5),
      audienceEngagementRating: z.number().min(1).max(5),
      setlistRespectRating: z.number().min(1).max(5),
      logisticReadinessRating: z.number().min(1).max(5),
      comment: z.string().max(300).optional(),
    });

    const schema =
      reviewRequest.reviewType === 'artist_reviews_venue'
        ? artistReviewsVenueSchema
        : venueReviewsArtistSchema;

    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Create review
    const reviewData: Record<string, any> = {
      reviewRequestId: reviewRequest.id,
      eventId: reviewRequest.eventId,
      reviewType: reviewRequest.reviewType as 'artist_reviews_venue' | 'venue_reviews_artist',
      reviewerEmail: reviewRequest.recipientEmail,
      reviewerId: reviewRequest.recipientUserId,
      comment: body.comment || null,
    };

    // Add ratings based on review type
    if (reviewRequest.reviewType === 'artist_reviews_venue') {
      reviewData.venueId = reviewRequest.event?.venueId;
      reviewData.hospitalityRating = body.hospitalityRating;
      reviewData.technicalQualityRating = body.technicalQualityRating;
      reviewData.agreementsRespectRating = body.agreementsRespectRating;
      reviewData.staffTreatmentRating = body.staffTreatmentRating;
      reviewData.organizationalQualityRating = body.organizationalQualityRating;
    } else {
      reviewData.artistId = reviewRequest.event?.artistId;
      reviewData.punctualityRating = body.punctualityRating;
      reviewData.professionalismRating = body.professionalismRating;
      reviewData.audienceEngagementRating = body.audienceEngagementRating;
      reviewData.setlistRespectRating = body.setlistRespectRating;
      reviewData.logisticReadinessRating = body.logisticReadinessRating;
    }

    const [newReview] = await database.insert(reviews).values(reviewData as any).returning();

    // Update review request status
    await database
      .update(reviewRequests)
      .set({ status: 'completed', updatedAt: new Date().toISOString() })
      .where(eq(reviewRequests.id, reviewRequest.id));

    return NextResponse.json(
      {
        message: 'Review submitted successfully',
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/reviews/submit/[token]] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
