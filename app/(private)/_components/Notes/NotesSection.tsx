'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileNote } from '@/lib/types';
import { notFound } from 'next/navigation';
import { NoteForm } from './NoteForm';
import { NoteItem } from './NoteItem';
import { deleteArtistNote } from '@/lib/server-actions/notes/delete-artist-note';
import { deleteProfileNote } from '@/lib/server-actions/notes/delete-profile-note';
import ConfirmDialog from '@/app/_components/ConfirmDialog';

export default function NotesSection({
  isArtist,
  initialNotes,
  writerId,
  receiverProfileId,
}: {
  isArtist: boolean;
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

    let response;

    if (isArtist) {
      response = await deleteArtistNote(id);
    } else {
      response = await deleteProfileNote(id);
    }

    if (!response.success) {
      setNotes(previousNotes);
      toast.error(response.message || 'Eliminazione nota non riuscita.');
    } else {
      toast.success('Nota eliminata!');
    }
  };

  return (
    <>
      <section className='h-80 md:h-auto max-w-full grid grid-rows-[auto_1fr] gap-2 bg-white py-8 px-6 rounded-2xl'>
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
            isArtist={isArtist}
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

      {/* delete existing note */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNoteId(null);
            setIsDeleteDialogOpen(false);
          } else {
            setIsDeleteDialogOpen(true);
          }
        }}
        title='Sei sicuro di voler eliminare la nota?'
        description='Attenzione: questa operazione è irreversibile. La nota verrà eliminata definitivamente.'
        confirmLabel='Elimina'
        cancelLabel='Annulla'
        onConfirm={() => {
          if (selectedNoteId != null) {
            handleDeleteNote(selectedNoteId);
            setSelectedNoteId(null);
            setIsDeleteDialogOpen(false);
          }
        }}
        onCancel={() => {
          setSelectedNoteId(null);
          setIsDeleteDialogOpen(false);
        }}
      />

      {/* delete new note draft */}
      <ConfirmDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        title='Sei sicuro di voler uscire?'
        description='Il processo verrà interrotto e i dati verranno persi.'
        confirmLabel='Esci'
        cancelLabel='Annulla'
        onConfirm={() => {
          setIsCancelDialogOpen(false);
          setIsFormVisible(false);
        }}
        onCancel={() => setIsCancelDialogOpen(false)}
      />
    </>
  );
}
