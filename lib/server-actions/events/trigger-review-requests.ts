'use server';

import { database } from '@/lib/database/connection';
import { reviewRequests, reviews, artists, venues } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { sendReviewRequestEmail } from '../send-review-request-email';

interface EventData {
  id: number;
  artistId: number;
  venueId: number;
  endedAt?: string | null;
  artist: {
    name: string;
    surname: string;
    stageName: string | null;
    email: string;
    tourManagerEmail: string | null;
  };
  venue: {
    name: string;
    billingEmail: string | null;
    billingPec: string | null;
  };
}

/**
 * Triggers review requests for a completed event
 * Only sends emails if reviews don't already exist
 */
export async function triggerReviewRequests(eventData: EventData): Promise<void> {
  try {
    console.log('[triggerReviewRequests] Processing event:', eventData.id);

    // Check if review requests already exist for this event
    const existingRequests = await database
      .select()
      .from(reviewRequests)
      .where(eq(reviewRequests.eventId, eventData.id));

    // Check if reviews already exist
    const existingReviews = await database
      .select()
      .from(reviews)
      .where(eq(reviews.eventId, eventData.id));

    const existingRequestTypes = existingRequests.map((r: any) => r.reviewType);
    const existingReviewTypes = existingReviews.map((r: any) => r.reviewType);

    console.log('[triggerReviewRequests] Existing requests:', existingRequestTypes);
    console.log('[triggerReviewRequests] Existing reviews:', existingReviewTypes);

    // Create review request for Artist to review Venue (only if no review exists)
    if (
      !existingRequestTypes.includes('artist_reviews_venue') &&
      !existingReviewTypes.includes('artist_reviews_venue')
    ) {
      const artistEmail = eventData.artist.tourManagerEmail || eventData.artist.email;

      if (artistEmail) {
        console.log('[triggerReviewRequests] Creating artist review request');
        
        const [artistRequest] = await database
          .insert(reviewRequests)
          .values({
            eventId: eventData.id,
            reviewType: 'artist_reviews_venue',
            recipientEmail: artistEmail,
            recipientUserId: null,
            emailSentAt: new Date().toISOString(),
          })
          .returning();

        // Send email
        await sendReviewRequestEmail(
          artistEmail,
          artistRequest.reviewToken,
          'artist_reviews_venue',
          {
            id: eventData.id,
            endedAt: eventData.endedAt || new Date().toISOString(),
            artist: eventData.artist,
            venue: eventData.venue,
          }
        );

        console.log('[triggerReviewRequests] Artist review email sent');
      }
    } else {
      console.log('[triggerReviewRequests] Skipping artist review (already exists)');
    }

    // Create review request for Venue to review Artist (only if no review exists)
    if (
      !existingRequestTypes.includes('venue_reviews_artist') &&
      !existingReviewTypes.includes('venue_reviews_artist')
    ) {
      const venueEmail = eventData.venue.billingEmail || eventData.venue.billingPec;

      if (venueEmail) {
        console.log('[triggerReviewRequests] Creating venue review request');
        
        const [venueRequest] = await database
          .insert(reviewRequests)
          .values({
            eventId: eventData.id,
            reviewType: 'venue_reviews_artist',
            recipientEmail: venueEmail,
            recipientUserId: null,
            emailSentAt: new Date().toISOString(),
          })
          .returning();

        // Send email
        await sendReviewRequestEmail(
          venueEmail,
          venueRequest.reviewToken,
          'venue_reviews_artist',
          {
            id: eventData.id,
            endedAt: eventData.endedAt || new Date().toISOString(),
            artist: eventData.artist,
            venue: eventData.venue,
          }
        );

        console.log('[triggerReviewRequests] Venue review email sent');
      }
    } else {
      console.log('[triggerReviewRequests] Skipping venue review (already exists)');
    }

    console.log('[triggerReviewRequests] Review requests processed successfully');
  } catch (error) {
    console.error('[triggerReviewRequests] Error:', error);
    // Don't throw - we don't want to fail the event completion if email fails
  }
}
