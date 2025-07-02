'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProfileNote } from '@/lib/server-actions/artist-manager/delete-profile-note';
import { ProfileNote } from '@/lib/types';
import { notFound } from 'next/navigation';
import { NoteForm } from './NoteForm';
import { DeleteNoteDialog } from './DeleteNoteDialog';
import { CancelNewNoteDialog } from './CancelNewNoteDialog';
import { NoteItem } from './NoteItem';

export default function NotesSection({
  initialNotes,
  writerId,
  receiverProfileId,
}: {
  initialNotes: ProfileNote[];
  writerId: string;
  receiverProfileId: number;
}) {
  const [notes, setNotes] = useState<ProfileNote[]>(initialNotes);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  if (!writerId || !receiverProfileId) {
    return notFound();
  }

  const handleDeleteNote = async (id: number) => {
    const previousNotes = [...notes];

    setNotes((prev) => prev.filter((note) => note.id !== id));
    const response = await deleteProfileNote(id);
    if (!response.success) {
      setNotes(previousNotes);
      toast.error(response.message || 'Eliminazione nota non riuscita.');
    } else {
      toast.success('Nota eliminata!');
    }
  };

  return (
    <>
      <section className='max-h-80 grid grid-rows-[auto_1fr] gap-2 bg-white py-8 px-6 rounded-2xl'>
        <div className='flex justify-between items-center'>
          <div className='text-xl font-semibold'>Note</div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsFormVisible(true)}
          >
            <Plus className='scale-125' />
          </Button>
        </div>

        {isFormVisible ? (
          <NoteForm
            writerId={writerId}
            receiverProfileId={receiverProfileId}
            onSuccess={(note) => {
              setNotes((prev) => [note, ...prev]);
              setIsFormVisible(false);
            }}
            onCancel={() => {
              setIsFormVisible(false);
            }}
            onCancelConfirm={() => {
              setIsCancelDialogOpen(true);
            }}
          />
        ) : notes.length > 0 ? (
          <div className='max-h-full flex flex-col gap-2 overflow-y-auto'>
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={(id) => {
                  setSelectedNoteId(id);
                  setIsDeleteDialogOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className='flex justify-center items-center font-semibold'>
            Nessuna nota.
          </div>
        )}
      </section>

      <DeleteNoteDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setSelectedNoteId(null);
          setIsDeleteDialogOpen(false);
        }}
        onConfirm={() => {
          if (selectedNoteId != null) {
            handleDeleteNote(selectedNoteId);
            setSelectedNoteId(null);
            setIsDeleteDialogOpen(false);
          }
        }}
      />

      <CancelNewNoteDialog
        open={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={() => {
          setIsCancelDialogOpen(false);
          setIsFormVisible(false);
        }}
      />
    </>
  );
}
