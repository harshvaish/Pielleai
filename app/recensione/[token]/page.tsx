'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

interface ReviewRequestData {
  id: number;
  eventId: number;
  reviewType: 'artist_reviews_venue' | 'venue_reviews_artist';
  event: any;
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

export default function ReviewSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewRequest, setReviewRequest] = useState<ReviewRequestData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchReviewRequest();
  }, [token]);

  const fetchReviewRequest = async () => {
    try {
      const response = await fetch(`/api/reviews/submit/${token}`);
      const data = await response.json();

      if (!response.ok) {
        if (data.submitted) {
          setError('Questa recensione è già stata inviata. Grazie per il tuo contributo!');
        } else {
          setError(data.error || 'Link non valido o scaduto');
        }
        return;
      }

      setReviewRequest(data.reviewRequest);
    } catch (err) {
      setError('Errore nel caricamento della recensione');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewRequest) return;

    // Validate all ratings are provided
    const ratingLabels =
      reviewRequest.reviewType === 'artist_reviews_venue'
        ? RATING_LABELS_ARTIST_REVIEWS_VENUE
        : RATING_LABELS_VENUE_REVIEWS_ARTIST;

    const missingRatings = Object.keys(ratingLabels).filter((key) => !ratings[key]);

    if (missingRatings.length > 0) {
      toast.error('Per favore, completa tutte le valutazioni');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/reviews/submit/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ratings,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Errore durante l\'invio della recensione');
        return;
      }

      toast.success('Recensione inviata con successo!');
      
      // Show success message
      setError('✓ Grazie! La tua recensione è stata inviata correttamente.');
      setReviewRequest(null);
      
    } catch (err) {
      console.error(err);
      toast.error('Errore durante l\'invio della recensione');
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
              className={`w-8 h-8 ${
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (error || !reviewRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>
              {error?.includes('✓') ? 'Recensione Inviata' : 'Attenzione'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={error?.includes('✓') ? 'text-green-600' : 'text-gray-600'}>
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isArtistReviewingVenue = reviewRequest.reviewType === 'artist_reviews_venue';
  const ratingLabels = isArtistReviewingVenue
    ? RATING_LABELS_ARTIST_REVIEWS_VENUE
    : RATING_LABELS_VENUE_REVIEWS_ARTIST;

  const entityName = isArtistReviewingVenue
    ? reviewRequest.event?.venue?.name
    : reviewRequest.event?.artist?.name;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Recensione {isArtistReviewingVenue ? 'Locale' : 'Artista'}</CardTitle>
            <CardDescription>
              Valuta la tua esperienza con <strong>{entityName}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {Object.entries(ratingLabels).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-base font-medium">{label}</Label>
                  {renderStars(key)}
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="comment" className="text-base font-medium">
                  Commento opzionale (max 300 caratteri)
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 300))}
                  placeholder="Condividi ulteriori dettagli sulla tua esperienza..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500 text-right">{comment.length}/300</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Questa recensione è riservata e visibile solo agli
                  amministratori. Non sarà pubblica e non potrà essere modificata dopo l'invio.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Invio in corso...' : 'Invia recensione'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
