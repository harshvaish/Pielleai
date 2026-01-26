import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { events, reviewRequests, artists, venues } from '@/drizzle/schema';
import { eq, and, isNull, lt, sql } from 'drizzle-orm';
import { sendReviewRequestEmail } from '@/lib/server-actions/send-review-request-email';

/**
 * POST /api/cron/trigger-review-requests
 * Cron job to automatically trigger review requests for completed events
 * Should be called 24 hours after events are marked as completed
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

    // Find all completed events that:
    // 1. Have status 'completed'
    // 2. Were completed at least 24 hours ago
    // 3. Don't have review requests yet
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const eligibleEvents = await database
      .select({
        event: events,
        artist: artists,
        venue: venues,
      })
      .from(events)
      .leftJoin(artists, eq(events.artistId, artists.id))
      .leftJoin(venues, eq(events.venueId, venues.id))
      .where(
        and(
          eq(events.status, 'completed'),
          lt(events.endedAt, twentyFourHoursAgo.toISOString()),
          isNull(events.rejectedAt) // Not rejected
        )
      );

    const results = {
      processed: 0,
      created: 0,
      errors: [] as string[],
    };

    for (const { event, artist, venue } of eligibleEvents) {
      if (!event || !artist || !venue) continue;

      try {
        results.processed++;

        // Check if review requests already exist for this event
        const existingRequests = await database
          .select()
          .from(reviewRequests)
          .where(eq(reviewRequests.eventId, event.id));

        if (existingRequests.length >= 2) {
          // Both requests already exist
          continue;
        }

        const existingTypes = existingRequests.map((r: any) => r.reviewType);

        // Create review request for Artist to review Venue
        if (!existingTypes.includes('artist_reviews_venue')) {
          const artistEmail = artist.tourManagerEmail || artist.email;
          
          if (artistEmail) {
            const [artistRequest] = await database
              .insert(reviewRequests)
              .values({
                eventId: event.id,
                reviewType: 'artist_reviews_venue',
                recipientEmail: artistEmail,
                recipientUserId: null, // Can be populated if you have user mapping
                emailSentAt: new Date().toISOString(),
              })
              .returning();

            // Send email
            await sendReviewRequestEmail(
              artistEmail,
              artistRequest.reviewToken,
              'artist_reviews_venue',
              { ...event, artist, venue }
            );

            results.created++;
          }
        }

        // Create review request for Venue to review Artist
        if (!existingTypes.includes('venue_reviews_artist')) {
          const venueEmail = venue.billingEmail || venue.billingPec;
          
          if (venueEmail) {
            const [venueRequest] = await database
              .insert(reviewRequests)
              .values({
                eventId: event.id,
                reviewType: 'venue_reviews_artist',
                recipientEmail: venueEmail,
                recipientUserId: null, // Can be populated if you have user mapping
                emailSentAt: new Date().toISOString(),
              })
              .returning();

            // Send email
            await sendReviewRequestEmail(
              venueEmail,
              venueRequest.reviewToken,
              'venue_reviews_artist',
              { ...event, artist, venue }
            );

            results.created++;
          }
        }
      } catch (error) {
        console.error(`[Cron] Error processing event ${event.id}:`, error);
        results.errors.push(`Event ${event.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Review requests processed',
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
