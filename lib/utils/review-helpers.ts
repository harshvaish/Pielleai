import { database } from '@/lib/database/connection';
import { reviews } from '@/drizzle/schema';
import { eq, and, isNull, avg, count, sql } from 'drizzle-orm';

/**
 * Calculate average ratings for an artist
 */
export async function getArtistAverageRatings(artistId: number) {
  const artistReviews = await database
    .select({
      avgPunctuality: avg(reviews.punctualityRating),
      avgProfessionalism: avg(reviews.professionalismRating),
      avgAudienceEngagement: avg(reviews.audienceEngagementRating),
      avgSetlistRespect: avg(reviews.setlistRespectRating),
      avgLogisticReadiness: avg(reviews.logisticReadinessRating),
      totalReviews: count(reviews.id),
    })
    .from(reviews)
    .where(
      and(
        eq(reviews.artistId, artistId),
        isNull(reviews.deletedAt),
        eq(reviews.markedAsInappropriate, false)
      )
    );

  const data = artistReviews[0];

  if (!data || data.totalReviews === 0) {
    return null;
  }

  const ratings = [
    parseFloat(data.avgPunctuality || '0'),
    parseFloat(data.avgProfessionalism || '0'),
    parseFloat(data.avgAudienceEngagement || '0'),
    parseFloat(data.avgSetlistRespect || '0'),
    parseFloat(data.avgLogisticReadiness || '0'),
  ].filter((r) => r > 0);

  const overallAverage =
    ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

  return {
    punctuality: parseFloat(data.avgPunctuality || '0'),
    professionalism: parseFloat(data.avgProfessionalism || '0'),
    audienceEngagement: parseFloat(data.avgAudienceEngagement || '0'),
    setlistRespect: parseFloat(data.avgSetlistRespect || '0'),
    logisticReadiness: parseFloat(data.avgLogisticReadiness || '0'),
    overall: overallAverage,
    totalReviews: data.totalReviews,
  };
}

/**
 * Calculate average ratings for a venue
 */
export async function getVenueAverageRatings(venueId: number) {
  const venueReviews = await database
    .select({
      avgHospitality: avg(reviews.hospitalityRating),
      avgTechnicalQuality: avg(reviews.technicalQualityRating),
      avgAgreementsRespect: avg(reviews.agreementsRespectRating),
      avgStaffTreatment: avg(reviews.staffTreatmentRating),
      avgOrganizationalQuality: avg(reviews.organizationalQualityRating),
      totalReviews: count(reviews.id),
    })
    .from(reviews)
    .where(
      and(
        eq(reviews.venueId, venueId),
        isNull(reviews.deletedAt),
        eq(reviews.markedAsInappropriate, false)
      )
    );

  const data = venueReviews[0];

  if (!data || data.totalReviews === 0) {
    return null;
  }

  const ratings = [
    parseFloat(data.avgHospitality || '0'),
    parseFloat(data.avgTechnicalQuality || '0'),
    parseFloat(data.avgAgreementsRespect || '0'),
    parseFloat(data.avgStaffTreatment || '0'),
    parseFloat(data.avgOrganizationalQuality || '0'),
  ].filter((r) => r > 0);

  const overallAverage =
    ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

  return {
    hospitality: parseFloat(data.avgHospitality || '0'),
    technicalQuality: parseFloat(data.avgTechnicalQuality || '0'),
    agreementsRespect: parseFloat(data.avgAgreementsRespect || '0'),
    staffTreatment: parseFloat(data.avgStaffTreatment || '0'),
    organizationalQuality: parseFloat(data.avgOrganizationalQuality || '0'),
    overall: overallAverage,
    totalReviews: data.totalReviews,
  };
}

/**
 * Get all reviews for an artist
 */
export async function getArtistReviews(artistId: number, includeDeleted = false) {
  const conditions = [eq(reviews.artistId, artistId)];
  
  if (!includeDeleted) {
    conditions.push(isNull(reviews.deletedAt));
  }

  return await database.query.reviews.findMany({
    where: and(...conditions),
    with: {
      event: {
        with: {
          venue: true,
        },
      },
    },
    orderBy: (reviewsTable, { desc }) => [desc(reviewsTable.createdAt)],
  });
}

/**
 * Get all reviews for a venue
 */
export async function getVenueReviews(venueId: number, includeDeleted = false) {
  const conditions = [eq(reviews.venueId, venueId)];
  
  if (!includeDeleted) {
    conditions.push(isNull(reviews.deletedAt));
  }

  return await database.query.reviews.findMany({
    where: and(...conditions),
    with: {
      event: {
        with: {
          artist: true,
        },
      },
    },
    orderBy: (reviewsTable, { desc }) => [desc(reviewsTable.createdAt)],
  });
}

/**
 * Get review statistics for an event
 */
export async function getEventReviewStats(eventId: number) {
  const eventReviews = await database.query.reviews.findMany({
    where: and(eq(reviews.eventId, eventId), isNull(reviews.deletedAt)),
  });

  const artistReview = eventReviews.find((r: any) => r.reviewType === 'venue_reviews_artist');
  const venueReview = eventReviews.find((r: any) => r.reviewType === 'artist_reviews_venue');

  return {
    hasArtistReview: !!artistReview,
    hasVenueReview: !!venueReview,
    artistReview,
    venueReview,
  };
}
