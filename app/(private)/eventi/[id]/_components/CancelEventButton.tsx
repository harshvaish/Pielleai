'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cancelEvent } from '@/lib/server-actions/events/cancel-event';

const MIN_REASON_LENGTH = 3;

type CancelEventButtonProps = {
  eventId: number;
  eventTitle: string;
  disabled?: boolean;
  disabledReason?: string;
};

export default function CancelEventButton({
  eventId,
  eventTitle,
  disabled = false,
  disabledReason,
}: CancelEventButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestedBy, setRequestedBy] = useState<'venue' | 'booking'>('booking');
  const [bookingType, setBookingType] = useState<'peaceful' | 'legal-dispute'>('peaceful');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const notesValue = notes.trim();
  const isReasonValid = notesValue.length >= MIN_REASON_LENGTH;
  const isBooking = requestedBy === 'booking';
  const isLegalDispute = isBooking && bookingType === 'legal-dispute';

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setRequestedBy('booking');
      setBookingType('peaceful');
      setNotes('');
      setError(null);
      setLoading(false);
    }
  };

  const onConfirm = async () => {
    if (!isReasonValid) {
      setError(`Inserisci almeno ${MIN_REASON_LENGTH} caratteri.`);
      return;
    }

    setLoading(true);
    const response = await cancelEvent({
      eventId,
      requestedBy,
      bookingCancellationType: isBooking ? bookingType : undefined,
      notes: notesValue,
    });

    if (!response.success) {
      toast.error(response.message || 'Annullamento non riuscito.');
      setLoading(false);
      return;
    }

    toast.success('Evento annullato.');
    setLoading(false);
    handleOpenChange(false);
    router.refresh();
  };

  return (
    <>
      <div className='flex flex-col items-start gap-2'>
        <Button
          variant='destructive'
          size='sm'
          onClick={() => setOpen(true)}
          disabled={disabled || loading}
        >
          Annulla evento
        </Button>
        {disabled && disabledReason && (
          <span className='text-xs text-zinc-500'>{disabledReason}</span>
        )}
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={handleOpenChange}
        title='Annullamento evento'
        description={`Stai annullando l'evento "${eventTitle}". Completa i dettagli richiesti.`}
        confirmLabel='Annulla evento'
        cancelLabel='Annulla'
        confirmButtonVariant='destructive'
      >
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold'>Richiedente annullamento</label>
            <RadioGroup
              value={requestedBy}
              onValueChange={(value) => setRequestedBy(value as 'venue' | 'booking')}
              className='grid gap-2'
            >
              <label className='flex items-center gap-2 text-sm'>
                <RadioGroupItem value='venue' />
                Locale
              </label>
              <label className='flex items-center gap-2 text-sm'>
                <RadioGroupItem value='booking' />
                Booking
              </label>
            </RadioGroup>
          </div>

          {isBooking && (
            <div className='space-y-2'>
              <label className='text-sm font-semibold'>Tipo di annullamento</label>
              <RadioGroup
                value={bookingType}
                onValueChange={(value) => setBookingType(value as 'peaceful' | 'legal-dispute')}
                className='grid gap-2'
              >
                <label className='flex items-center gap-2 text-sm'>
                  <RadioGroupItem value='peaceful' />
                  Annullamento pacifico
                </label>
                <label className='flex items-center gap-2 text-sm'>
                  <RadioGroupItem value='legal-dispute' />
                  Contestazione legale
                </label>
              </RadioGroup>
              {isLegalDispute && (
                <p className='text-xs text-amber-700'>
                  Verra inviata automaticamente una email al contatto legale con i dettagli
                  dell&apos;evento e la motivazione.
                </p>
              )}
            </div>
          )}

          <div className='space-y-2'>
            <label className='text-sm font-semibold'>Motivazione (obbligatoria)</label>
            <Textarea
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Inserisci la motivazione dell'annullamento..."
              rows={4}
            />
            {error && <p className='text-xs text-destructive'>{error}</p>}
            <p className='text-xs text-zinc-500'>
              La motivazione verra registrata nel log dell&apos;evento.
            </p>
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={onConfirm}
              disabled={!isReasonValid || loading}
            >
              {loading ? 'Annullamento...' : 'Conferma annullamento'}
            </Button>
          </div>
        </div>
      </ConfirmDialog>
    </>
  );
}
