'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Star, Trash2, Eye, Filter, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface Review {
  id: number;
  reviewType: string;
  reviewerEmail: string;
  createdAt: string;
  comment: string | null;
  deletedAt: string | null;
  markedAsInappropriate: boolean;
  markedAsInappropriateAt: string | null;
  // Ratings
  hospitalityRating: number | null;
  technicalQualityRating: number | null;
  agreementsRespectRating: number | null;
  staffTreatmentRating: number | null;
  organizationalQualityRating: number | null;
  punctualityRating: number | null;
  professionalismRating: number | null;
  audienceEngagementRating: number | null;
  setlistRespectRating: number | null;
  logisticReadinessRating: number | null;
}

interface ReviewData {
  review: Review;
  event: any;
  artist: any;
  venue: any;
}

export default function ReviewsManagementClient() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inappropriateDialogOpen, setInappropriateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [includeDeleted]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?includeDeleted=${includeDeleted}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews || []);
      } else {
        toast.error('Errore nel caricamento delle recensioni');
      }
    } catch (error) {
      console.error(error);
      toast.error('Errore nel caricamento delle recensioni');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInappropriate = (reviewData: ReviewData) => {
    setSelectedReview(reviewData);
    setInappropriateDialogOpen(true);
  };

  const handleView = (reviewData: ReviewData) => {
    setSelectedReview(reviewData);
    setViewDialogOpen(true);
  };

  const handleDelete = (reviewData: ReviewData) => {
    setSelectedReview(reviewData);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReview) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/reviews/${selectedReview.review.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Recensione eliminata con successo');
        fetchReviews();
        setDeleteDialogOpen(false);
      } else {
        toast.error('Errore durante l\'eliminazione');
      }
    } catch (error) {
      console.error(error);
      toast.error('Errore durante l\'eliminazione');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmMarkInappropriate = async () => {
    if (!selectedReview) return;

    const isCurrentlyMarked = selectedReview.review.markedAsInappropriate;
    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/reviews/${selectedReview.review.id}/mark-inappropriate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markAsInappropriate: !isCurrentlyMarked }),
        }
      );

      if (response.ok) {
        toast.success(
          isCurrentlyMarked
            ? 'Recensione rimossa dal flag inappropriato'
            : 'Recensione contrassegnata come inappropriata'
        );
        fetchReviews();
        setInappropriateDialogOpen(false);
      } else {
        toast.error('Errore durante l\'operazione');
      }
    } catch (error) {
      console.error(error);
      toast.error('Errore durante l\'operazione');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">N/A</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  const getAverageRating = (review: Review) => {
    const isArtistReviewingVenue = review.reviewType === 'artist_reviews_venue';
    
    const ratings = isArtistReviewingVenue
      ? [
          review.hospitalityRating,
          review.technicalQualityRating,
          review.agreementsRespectRating,
          review.staffTreatmentRating,
          review.organizationalQualityRating,
        ]
      : [
          review.punctualityRating,
          review.professionalismRating,
          review.audienceEngagementRating,
          review.setlistRespectRating,
          review.logisticReadinessRating,
        ];

    const validRatings = ratings.filter((r): r is number => r !== null);
    if (validRatings.length === 0) return 0;
    
    return (validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length).toFixed(1);
  };

  const getStatusBadge = (review: Review) => {
    if (review.deletedAt) {
      return <Badge variant="destructive">Eliminata</Badge>;
    }
    if (review.markedAsInappropriate) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Inappropriata
        </Badge>
      );
    }
    return <Badge variant="default">Completata</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento recensioni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestione Recensioni</CardTitle>
              <CardDescription>
                Visualizza, elimina e contrassegna come inappropriata le recensioni degli eventi
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setIncludeDeleted(!includeDeleted)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {includeDeleted ? 'Nascondi eliminate' : 'Mostra eliminate'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nessuna recensione trovata</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Recensore</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map(({ review, event, artist, venue }) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">
                      {artist?.name} @ {venue?.name}
                    </TableCell>
                    <TableCell>
                      {review.reviewType === 'artist_reviews_venue'
                        ? 'Artista → Locale'
                        : 'Locale → Artista'}
                    </TableCell>
                    <TableCell className="text-sm">{review.reviewerEmail}</TableCell>
                    <TableCell>{renderStars(Number(getAverageRating(review)) || 0)}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(review.createdAt), 'dd MMM yyyy', { locale: it })}
                    </TableCell>
                    <TableCell>{getStatusBadge(review)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView({ review, event, artist, venue })}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!review.deletedAt && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkInappropriate({ review, event, artist, venue })}
                              className={review.markedAsInappropriate ? 'text-orange-600' : 'text-gray-600'}
                              title={review.markedAsInappropriate ? 'Rimuovi flag inappropriato' : 'Contrassegna come inappropriata'}
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete({ review, event, artist, venue })}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dettagli Recensione</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500">Evento</Label>
                <p className="font-medium">
                  {selectedReview.artist?.name} @ {selectedReview.venue?.name}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Tipo</Label>
                  <p>
                    {selectedReview.review.reviewType === 'artist_reviews_venue'
                      ? 'Artista → Locale'
                      : 'Locale → Artista'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Recensore</Label>
                  <p className="text-sm">{selectedReview.review.reviewerEmail}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="font-semibold">Valutazioni</Label>
                <div className="space-y-2 mt-2">
                  {selectedReview.review.reviewType === 'artist_reviews_venue' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span>Ospitalità</span>
                        {renderStars(selectedReview.review.hospitalityRating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Qualità tecnica</span>
                        {renderStars(selectedReview.review.technicalQualityRating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Rispetto accordi</span>
                        {renderStars(selectedReview.review.agreementsRespectRating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trattamento staff</span>
                        {renderStars(selectedReview.review.staffTreatmentRating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Qualità organizzativa</span>
                        {renderStars(selectedReview.review.organizationalQualityRating)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span>Puntualità</span>
                        {renderStars(selectedReview.review.punctualityRating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Professionalità</span>
                        {renderStars(selectedReview.review.professionalismRating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Coinvolgimento pubblico</span>
                        {renderStars(selectedReview.review.audienceEngagementRating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Rispetto scaletta</span>
                        {renderStars(selectedReview.review.setlistRespectRating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Gestione logistica</span>
                        {renderStars(selectedReview.review.logisticReadinessRating)}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedReview.review.comment && (
                <div className="border-t pt-4">
                  <Label className="font-semibold">Commento</Label>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedReview.review.comment}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma eliminazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare questa recensione? L'azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>
              {submitting ? 'Eliminazione...' : 'Elimina'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Inappropriate Dialog */}
      <Dialog open={inappropriateDialogOpen} onOpenChange={setInappropriateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedReview?.review.markedAsInappropriate
                ? 'Rimuovi flag inappropriato'
                : 'Contrassegna come inappropriata'}
            </DialogTitle>
            <DialogDescription>
              {selectedReview?.review.markedAsInappropriate
                ? 'Questa recensione verrà rimossa dal flag inappropriato e sarà inclusa nei calcoli delle valutazioni.'
                : 'Questa recensione sarà contrassegnata come inappropriata e non sarà inclusa nei calcoli delle valutazioni medie.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInappropriateDialogOpen(false)}>
              Annulla
            </Button>
            <Button
              variant={selectedReview?.review.markedAsInappropriate ? 'default' : 'destructive'}
              onClick={confirmMarkInappropriate}
              disabled={submitting}
            >
              {submitting
                ? 'Elaborazione...'
                : selectedReview?.review.markedAsInappropriate
                ? 'Rimuovi flag'
                : 'Contrassegna'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
