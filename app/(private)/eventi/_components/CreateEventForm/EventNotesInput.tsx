'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EventFormSchema } from '@/lib/validation/eventFormSchema';
import { cn } from '@/lib/utils';

export default function EventNotesInput() {
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { watch, setValue, getValues } = useFormContext<EventFormSchema>();

  const notes = watch('notes') || [];

  const handleAddNote = () => {
    if (newNote.trim().length >= 3) {
      const currentNotes = getValues('notes') || [];
      setValue('notes', [...currentNotes, newNote.trim()]);
      setNewNote('');
      setError('');
      setIsInputVisible(false);
    } else {
      setError('Almeno 3 caratteri.');
    }
  };

  const handleRemoveNote = (indexToRemove: number) => {
    const updatedNotes = notes.filter((_, index) => index !== indexToRemove);
    setValue('notes', updatedNotes);
  };

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center gap-2 mb-2'>
        <div className='font-semibold'>Note</div>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => setIsInputVisible(true)}
        >
          <Plus />
        </Button>
      </div>

      {isInputVisible && (
        <div>
          <Input
            placeholder='Da controllare le luci...'
            value={newNote}
            className={cn(error && 'text-destructive border-destructive')}
            onChange={(e) => setNewNote(e.target.value)}
          />
          {error && (
            <div className='text-xs text-destructive mt-2'>{error}</div>
          )}
          <div className='flex justify-end items-center gap-2 mt-4'>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => setIsInputVisible(false)}
            >
              Annulla
            </Button>
            <Button
              type='button'
              size='sm'
              onClick={handleAddNote}
            >
              Inserisci
            </Button>
          </div>
        </div>
      )}

      {!isInputVisible &&
        notes.map((note, index) => (
          <div
            key={index}
            className='flex justify-between items-center ps-2 mb-2 border border-zinc-200 rounded-xl'
          >
            <span className='text-sm'>{note}</span>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => handleRemoveNote(index)}
            >
              <Trash2 className='size-3 text-destructive' />
            </Button>
          </div>
        ))}

      {!isInputVisible && notes.length === 0 && (
        <div className='py-1 text-sm text-zinc-500'>
          Premi il pulsante + per aggiungere una nota.
        </div>
      )}
    </div>
  );
}
