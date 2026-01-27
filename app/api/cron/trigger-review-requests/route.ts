import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { events, reviewRequests, reviews, artists, venues } from '@/drizzle/schema';
import { eq, and, isNull, lt, or } from 'drizzle-orm';
import { sendReviewRequestEmail } from '@/lib/server-actions/send-review-request-email';

/**
 * POST /api/cron/trigger-review-requests
 * Cron job to send reminder emails for pending review requests
 * Sends reminders 24 hours after the last email was sent, if review not yet submitted
 * 
 * This endpoint should be secured with a cron secret or API key
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secure-cron-secret';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find all pending review requests where:
    // 1. Status is 'pending'
    // 2. Email was sent at least 24 hours ago (initial or last resend)
    // 3. No review has been submitted yet
    const pendingRequests = await database
      .select({
        request: reviewRequests,
        event: events,
        artist: artists,
        venue: venues,
      })
      .from(reviewRequests)
      .innerJoin(events, eq(reviewRequests.eventId, events.id))
      .leftJoin(artists, eq(events.artistId, artists.id))
      .leftJoin(venues, eq(events.venueId, venues.id))
      .where(
        and(
          eq(reviewRequests.status, 'pending'),
          or(
            // Last resend was 24+ hours ago
            lt(reviewRequests.lastEmailResendAt, twentyFourHoursAgo.toISOString()),
            // No resend yet, but initial email was 24+ hours ago
            and(
              isNull(reviewRequests.lastEmailResendAt),
              lt(reviewRequests.emailSentAt, twentyFourHoursAgo.toISOString())
            )
          )
        )
      );

    const results = {
      processed: 0,
      remindersSent: 0,
      errors: [] as string[],
    };

    for (const { request, event, artist, venue } of pendingRequests) {
      if (!request || !event || !artist || !venue) continue;

      try {
        results.processed++;

        // Check if review has been submitted for this request
        const existingReview = await database
          .select()
          .from(reviews)
          .where(
            and(
              eq(reviews.reviewRequestId, request.id),
              eq(reviews.eventId, request.eventId)
            )
          )
          .limit(1);

        // Skip if review already submitted
        if (existingReview.length > 0) {
          console.log(`[Cron] Skipping request ${request.id} - review already submitted`);
          
          // Update status to completed
          await database
            .update(reviewRequests)
            .set({ status: 'completed', updatedAt: new Date().toISOString() })
            .where(eq(reviewRequests.id, request.id));
          
          continue;
        }

        console.log(`[Cron] Sending reminder for request ${request.id}, type: ${request.reviewType}`);

        // Send reminder email
        await sendReviewRequestEmail(
          request.recipientEmail,
          request.reviewToken,
          request.reviewType,
          { ...event, artist, venue }
        );

        // Update last resend timestamp
        await database
          .update(reviewRequests)
          .set({
            lastEmailResendAt: new Date().toISOString(),
            emailResendCount: (request.emailResendCount || 0) + 1,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(reviewRequests.id, request.id));

        results.remindersSent++;
        console.log(`[Cron] Reminder sent for request ${request.id}`);
      } catch (error) {
        console.error(`[Cron] Error processing request ${request.id}:`, error);
        results.errors.push(`Request ${request.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Review reminder emails processed',
        stats: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/cron/trigger-review-requests] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
