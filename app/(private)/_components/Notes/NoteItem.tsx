import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { format } from 'date-fns';
import { ProfileNote } from '@/lib/types';

export function NoteItem({
  note,
  onDelete,
}: {
  note: ProfileNote;
  onDelete: (id: number) => void;
}) {
  return (
    <div className='pb-4 border-b border-zinc-100'>
      <div className='flex justify-between items-center'>
        <div className='text-xs font-semibold text-zinc-400'>
          {format(note.createdAt, 'dd/MM/yyyy, HH:mm')}
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onDelete(note.id)}
        >
          <Ellipsis className='stroke-1' />
        </Button>
      </div>
      <p className='text-sm font-medium text-zinc-700'>{note.content}</p>
    </div>
  );
}
