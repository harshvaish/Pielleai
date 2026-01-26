// Type definitions for review system

export type ReviewType = 'artist_reviews_venue' | 'venue_reviews_artist';

export type ReviewStatus = 'pending' | 'completed' | 'modified' | 'deleted';

export interface ReviewRequest {
  id: number;
  eventId: number;
  reviewType: ReviewType;
  recipientEmail: string;
  recipientUserId: string | null;
  reviewToken: string;
  status: ReviewStatus;
  emailSentAt: string | null;
  emailResendCount: number;
  lastEmailResendAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistReviewsVenueData {
  hospitalityRating: number;
  technicalQualityRating: number;
  agreementsRespectRating: number;
  staffTreatmentRating: number;
  organizationalQualityRating: number;
  comment?: string;
}

export interface VenueReviewsArtistData {
  punctualityRating: number;
  professionalismRating: number;
  audienceEngagementRating: number;
  setlistRespectRating: number;
  logisticReadinessRating: number;
  comment?: string;
}

export interface Review {
  id: number;
  reviewRequestId: number;
  eventId: number;
  reviewType: ReviewType;
  reviewerId: string | null;
  reviewerEmail: string;
  artistId: number | null;
  venueId: number | null;
  
  // Artist reviews Venue ratings
  hospitalityRating: number | null;
  technicalQualityRating: number | null;
  agreementsRespectRating: number | null;
  staffTreatmentRating: number | null;
  organizationalQualityRating: number | null;
  
  // Venue reviews Artist ratings
  punctualityRating: number | null;
  professionalismRating: number | null;
  audienceEngagementRating: number | null;
  setlistRespectRating: number | null;
  logisticReadinessRating: number | null;
  
  comment: string | null;
  
  // Admin moderation fields
  modifiedByAdminId: string | null;
  modifiedAt: string | null;
  deletedByAdminId: string | null;
  deletedAt: string | null;
  
  createdAt: string;
  updatedAt: string;
}

export interface ArtistAverageRatings {
  punctuality: number;
  professionalism: number;
  audienceEngagement: number;
  setlistRespect: number;
  logisticReadiness: number;
  overall: number;
  totalReviews: number;
}

export interface VenueAverageRatings {
  hospitality: number;
  technicalQuality: number;
  agreementsRespect: number;
  staffTreatment: number;
  organizationalQuality: number;
  overall: number;
  totalReviews: number;
}

export interface EventReviewStats {
  hasArtistReview: boolean;
  hasVenueReview: boolean;
  artistReview: Review | undefined;
  venueReview: Review | undefined;
}
