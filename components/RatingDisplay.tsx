'use client';

import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RatingDisplayProps {
  rating: number;
  totalReviews: number;
  label?: string;
  showCount?: boolean;
}

export function RatingDisplay({ rating, totalReviews, label, showCount = true }: RatingDisplayProps) {
  if (totalReviews === 0) {
    return (
      <div className="text-sm text-gray-500">
        {label && <span className="font-medium">{label}: </span>}
        Nessuna recensione
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm font-medium">{label}:</span>}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-semibold">{rating.toFixed(1)}</span>
        {showCount && (
          <span className="text-xs text-gray-500 ml-1">({totalReviews} recensioni)</span>
        )}
      </div>
    </div>
  );
}

interface ArtistRatingsCardProps {
  ratings: {
    punctuality: number;
    professionalism: number;
    audienceEngagement: number;
    setlistRespect: number;
    logisticReadiness: number;
    overall: number;
    totalReviews: number;
  };
}

export function ArtistRatingsCard({ ratings }: ArtistRatingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Valutazioni Artista</CardTitle>
          <Badge variant="secondary">{ratings.totalReviews} recensioni</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="pb-3 border-b">
          <RatingDisplay
            rating={ratings.overall}
            totalReviews={ratings.totalReviews}
            label="Media complessiva"
            showCount={false}
          />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Puntualità</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.punctuality)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.punctuality.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Professionalità</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.professionalism)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.professionalism.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Coinvolgimento pubblico</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.audienceEngagement)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.audienceEngagement.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Rispetto scaletta</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.setlistRespect)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.setlistRespect.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Gestione logistica</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.logisticReadiness)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.logisticReadiness.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface VenueRatingsCardProps {
  ratings: {
    hospitality: number;
    technicalQuality: number;
    agreementsRespect: number;
    staffTreatment: number;
    organizationalQuality: number;
    overall: number;
    totalReviews: number;
  };
}

export function VenueRatingsCard({ ratings }: VenueRatingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Valutazioni Locale</CardTitle>
          <Badge variant="secondary">{ratings.totalReviews} recensioni</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="pb-3 border-b">
          <RatingDisplay
            rating={ratings.overall}
            totalReviews={ratings.totalReviews}
            label="Media complessiva"
            showCount={false}
          />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Ospitalità</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.hospitality)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.hospitality.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Qualità tecnica</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.technicalQuality)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.technicalQuality.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Rispetto accordi</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.agreementsRespect)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.agreementsRespect.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Trattamento staff</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.staffTreatment)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.staffTreatment.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Qualità organizzativa</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(ratings.organizationalQuality)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs">{ratings.organizationalQuality.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
