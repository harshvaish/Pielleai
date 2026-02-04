
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface InAppRatingBannerProps {
  reviewType: 'artist_reviews_venue' | 'venue_reviews_artist';
  entityName: string;
  eventId: number;
}

const RATING_LABELS_ARTIST_REVIEWS_VENUE = {
  hospitalityRating: 'Ospitalità',
  technicalQualityRating: 'Qualità tecnica del locale',
  agreementsRespectRating: 'Rispetto degli accordi',
  staffTreatmentRating: 'Trattamento da parte dello staff',
  organizationalQualityRating: 'Qualità organizzativa generale',
};

const RATING_LABELS_VENUE_REVIEWS_ARTIST = {
  punctualityRating: 'Puntualità',
  professionalismRating: 'Professionalità',
  audienceEngagementRating: 'Coinvolgimento del pubblico',
  setlistRespectRating: 'Rispetto della scaletta',
  logisticReadinessRating: 'Gestione logistica',
};


export default function InAppRatingBanner({ reviewType, entityName, eventId }: InAppRatingBannerProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const ratingLabels =
    reviewType === 'artist_reviews_venue'
      ? RATING_LABELS_ARTIST_REVIEWS_VENUE
      : RATING_LABELS_VENUE_REVIEWS_ARTIST;

  useEffect(() => {
    // Check if already reviewed
    fetch(`/api/reviews/submit/in-app/check?eventId=${eventId}&reviewType=${reviewType}`)
      .then((res) => res.json())
      .then((data) => setAlreadyReviewed(data.alreadyReviewed))
      .catch(() => setAlreadyReviewed(false));
  }, [eventId, reviewType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missingRatings = Object.keys(ratingLabels).filter((key) => !ratings[key]);
    if (missingRatings.length > 0) {
      setError('Per favore, completa tutte le valutazioni');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews/submit/in-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, reviewType, ratings, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setAlreadyReviewed(true);
      } else if (data?.error === 'Review already submitted') {
        setAlreadyReviewed(true);
      } else {
        setError(data?.error || 'Errore durante l\'invio della recensione');
      }
    } catch (err) {
      setError('Errore durante l\'invio della recensione');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (ratingKey: string) => {
    const currentRating = ratings[ratingKey] || 0;
    const hovered = hoveredRating[ratingKey] || 0;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRatings({ ...ratings, [ratingKey]: star })}
            onMouseEnter={() => setHoveredRating({ ...hoveredRating, [ratingKey]: star })}
            onMouseLeave={() => setHoveredRating({ ...hoveredRating, [ratingKey]: 0 })}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hovered || currentRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating}/5` : ''}
        </span>
      </div>
    );
  };

  if (alreadyReviewed) {
    return (
      <Card className="mb-4 border-green-400 border-2 bg-green-50">
        <CardHeader>
          <CardTitle>Recensione inviata</CardTitle>
          <CardDescription>Hai già inviato la tua recensione per questa esperienza. Grazie!</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  if (success) {
    return (
      <Card className="mb-4 border-green-400 border-2 bg-green-50">
        <CardHeader>
          <CardTitle>Recensione inviata</CardTitle>
          <CardDescription>Grazie per aver lasciato la tua recensione!</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card className="mb-4 border-blue-400 border-2 bg-blue-50">
      <CardHeader>
        <CardTitle>Lascia una recensione</CardTitle>
        <CardDescription>
          Valuta la tua esperienza con <strong>{entityName}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(ratingLabels).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label className="text-base font-medium">{label}</Label>
              {renderStars(key)}
            </div>
          ))}
          <div className="space-y-1">
            <Label htmlFor="comment" className="text-base font-medium">
              Commento opzionale (max 300 caratteri)
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 300))}
              placeholder="Condividi ulteriori dettagli sulla tua esperienza..."
              rows={3}
              className="resize-none"
            />
            <p className="text-sm text-gray-500 text-right">{comment.length}/300</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Invio in corso...' : 'Invia recensione'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
