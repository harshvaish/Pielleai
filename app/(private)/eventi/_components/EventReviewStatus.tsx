'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface EventReviewStatusProps {
  eventId: number;
}

interface ReviewRequestStatus {
  artistRequest: {
    id: number | null;
    status: string | null;
    emailSentAt: string | null;
    hasReview: boolean;
  };
  venueRequest: {
    id: number | null;
    status: string | null;
    emailSentAt: string | null;
    hasReview: boolean;
  };
}

export default function EventReviewStatus({ eventId }: EventReviewStatusProps) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ReviewRequestStatus | null>(null);
  const [resending, setResending] = useState<'artist' | 'venue' | null>(null);

  useEffect(() => {
    fetchReviewStatus();
  }, [eventId]);

  const fetchReviewStatus = async () => {
    try {
      // This endpoint needs to be created or you can integrate this into the existing event API
      const response = await fetch(`/api/events/${eventId}/review-status`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching review status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (type: 'artist' | 'venue') => {
    const requestId =
      type === 'artist' ? status?.artistRequest.id : status?.venueRequest.id;

    if (!requestId) {
      toast.error('Richiesta di recensione non trovata');
      return;
    }

    setResending(type);

    try {
      const response = await fetch(`/api/reviews/resend-email/${requestId}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Email inviata con successo');
        fetchReviewStatus();
      } else {
        toast.error('Errore nell\'invio dell\'email');
      }
    } catch (error) {
      console.error(error);
      toast.error('Errore nell\'invio dell\'email');
    } finally {
      setResending(null);
    }
  };

  const getStatusBadge = (hasReview: boolean, requestStatus: string | null) => {
    if (hasReview) {
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Completata
        </Badge>
      );
    }
    if (requestStatus === 'pending') {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          In attesa
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        Non inviata
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recensioni Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Caricamento...</p>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  const showArtistSection =
    status.artistRequest.id || status.artistRequest.hasReview;
  const showVenueSection = status.venueRequest.id || status.venueRequest.hasReview;

  if (!showArtistSection && !showVenueSection) {
    return null; // Don't show card if no review requests exist
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recensioni Evento</CardTitle>
        <CardDescription>Stato delle recensioni post-evento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showArtistSection && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-sm">Recensione Artista → Locale</p>
              {getStatusBadge(
                status.artistRequest.hasReview,
                status.artistRequest.status
              )}
              {status.artistRequest.emailSentAt && (
                <p className="text-xs text-gray-500">
                  Email inviata:{' '}
                  {new Date(status.artistRequest.emailSentAt).toLocaleDateString('it-IT')}
                </p>
              )}
            </div>
            {!status.artistRequest.hasReview && status.artistRequest.id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResendEmail('artist')}
                disabled={resending === 'artist'}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                {resending === 'artist' ? 'Invio...' : 'Reinvia'}
              </Button>
            )}
          </div>
        )}

        {showVenueSection && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-sm">Recensione Locale → Artista</p>
              {getStatusBadge(
                status.venueRequest.hasReview,
                status.venueRequest.status
              )}
              {status.venueRequest.emailSentAt && (
                <p className="text-xs text-gray-500">
                  Email inviata:{' '}
                  {new Date(status.venueRequest.emailSentAt).toLocaleDateString('it-IT')}
                </p>
              )}
            </div>
            {!status.venueRequest.hasReview && status.venueRequest.id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResendEmail('venue')}
                disabled={resending === 'venue'}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                {resending === 'venue' ? 'Invio...' : 'Reinvia'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
