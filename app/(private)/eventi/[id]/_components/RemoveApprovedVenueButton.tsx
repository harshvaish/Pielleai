'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { removeApprovedVenue } from '@/lib/server-actions/events/remove-approved-venue';

const MIN_REASON_LENGTH = 3;

type RemoveApprovedVenueButtonProps = {
  eventId: number;
  eventTitle: string;
  venueName: string;
  canRemove: boolean;
  disabledReason?: string;
};

export default function RemoveApprovedVenueButton({
  eventId,
  eventTitle,
  venueName,
  canRemove,
  disabledReason,
}: RemoveApprovedVenueButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reasonValue = reason.trim();
  const isReasonValid = reasonValue.length >= MIN_REASON_LENGTH;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setReason('');
      setError(null);
    }
  };

  const onConfirm = async () => {
    if (!isReasonValid) {
      setError(`Inserisci almeno ${MIN_REASON_LENGTH} caratteri.`);
      return;
    }

    setLoading(true);
    const response = await removeApprovedVenue(eventId, reasonValue);

    if (!response.success) {
      toast.error(response.message || 'Rimozione non riuscita.');
    } else {
      toast.success("Locale rimosso dall'evento.");
    }

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
          disabled={!canRemove || loading}
        >
          Rimuovi locale
        </Button>
        {!canRemove && disabledReason && (
          <span className='text-xs text-zinc-500'>{disabledReason}</span>
        )}
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={handleOpenChange}
        title='Rimozione locale approvato'
        description={`Stai rimuovendo il locale "${venueName}" dall'evento "${eventTitle}".`}
        confirmLabel='Rimuovi'
        cancelLabel='Annulla'
        confirmButtonVariant='destructive'
      >
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold'>Motivo della rimozione (obbligatorio)</label>
            <Textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                if (error) setError(null);
              }}
              placeholder='Inserisci il motivo della rimozione...'
              rows={4}
            />
            {error && <p className='text-xs text-destructive'>{error}</p>}
            <p className='text-xs text-zinc-500'>
              Il motivo sara comunicato al locale rimosso e registrato nel log evento.
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
              {loading ? 'Rimozione...' : 'Conferma rimozione'}
            </Button>
          </div>
        </div>
      </ConfirmDialog>
    </>
  );
}
