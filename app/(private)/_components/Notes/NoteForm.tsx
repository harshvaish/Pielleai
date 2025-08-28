'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createProfileNote } from '@/lib/server-actions/notes/create-profile-note';
import { ProfileNote } from '@/lib/types';
import { newNoteSchema } from '@/lib/validation/newNoteSchema';
import { createArtistNote } from '@/lib/server-actions/notes/create-artist-note';

export function NoteForm({
  isArtist,
  writerId,
  receiverProfileId,
  onSuccess,
  onCancel,
  onCancelConfirm,
}: {
  isArtist: boolean;
  writerId: string;
  receiverProfileId: number;
  onSuccess: (note: ProfileNote) => void;
  onCancel: () => void;
  onCancelConfirm: () => void;
}) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (newNoteContent.trim().length > 0) {
      onCancelConfirm(); // show confirmation dialog
    } else {
      onCancel(); // just close the form
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = newNoteSchema.safeParse({
      writerId,
      receiverId: receiverProfileId,
      content: newNoteContent,
    });

    if (!validation.success) {
      console.error(validation.error.issues[0]);
      setError(validation.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      let response;

      if (isArtist) {
        response = await createArtistNote(writerId, receiverProfileId, validation.data.content);
      } else {
        response = await createProfileNote(writerId, receiverProfileId, validation.data.content);
      }

      if (!response.success || !response.data) {
        toast.error(response.message || 'Inserimento nota non riuscito.');
        return;
      }

      onSuccess(response.data as ProfileNote);
      setNewNoteContent('');
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className='flex flex-col justify-between'
    >
      <Textarea
        id='note'
        value={newNoteContent}
        onChange={(e) => setNewNoteContent(e.target.value)}
        autoFocus
        placeholder='Aggiungi nota'
        className='resize-none max-w-full h-full shadow-none'
      />
      {error && <p className='text-xs text-destructive mt-2'>{error}</p>}
      <div className='flex justify-end gap-2 mt-4'>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={isPending}
          onClick={handleCancel}
        >
          Annulla
        </Button>
        <Button
          type='submit'
          size='sm'
          disabled={isPending}
        >
          {isPending ? 'Inserimento...' : 'Inserisci'}
        </Button>
      </div>
    </form>
  );
}
