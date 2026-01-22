import Link from 'next/link';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { RevisionHistoryEntry } from '@/lib/data/events/get-event-revision-history';

const formatTimestamp = (value?: string | null) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return format(parsed, 'dd/MM/yyyy HH:mm', { locale: it });
};

type RevisionHistoryPanelProps = {
  history: RevisionHistoryEntry[];
  currentEventId: number;
};

export default function RevisionHistoryPanel({ history, currentEventId }: RevisionHistoryPanelProps) {
  return (
    <section className='bg-white p-6 rounded-2xl space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold'>Cronologia revisioni</h2>
      </div>
      <Separator />
      <div className='space-y-4'>
        {history.map((entry) => (
          <div key={entry.id} className='rounded-xl border border-zinc-200 p-4 space-y-3'>
            <div className='flex flex-wrap items-center gap-2 justify-between'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-semibold'>v{entry.revisionNumber}</span>
                {entry.protocolNumber && (
                  <Badge variant='secondary'>Protocollo: {entry.protocolNumber}</Badge>
                )}
                {entry.id === currentEventId && <Badge>Attuale</Badge>}
              </div>
              {entry.id !== currentEventId && (
                <Link className='text-sm text-blue-600 hover:underline' href={`/eventi/${entry.id}`}>
                  Apri versione
                </Link>
              )}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
              <div>
                <span className='font-semibold text-zinc-600'>Motivo:</span>{' '}
                <span className='text-zinc-700'>{entry.reason ?? '-'}</span>
              </div>
              <div>
                <span className='font-semibold text-zinc-600'>Autore:</span>{' '}
                <span className='text-zinc-700'>{entry.createdBy ?? '-'}</span>
              </div>
              <div className='sm:col-span-2'>
                <span className='font-semibold text-zinc-600'>Descrizione:</span>{' '}
                <span className='text-zinc-700'>{entry.description ?? '-'}</span>
              </div>
              <div>
                <span className='font-semibold text-zinc-600'>Data:</span>{' '}
                <span className='text-zinc-700'>{formatTimestamp(entry.createdAt)}</span>
              </div>
            </div>
            {entry.changes.length > 0 ? (
              <div className='space-y-2'>
                <div className='text-sm font-semibold text-zinc-600'>Modifiche</div>
                <div className='space-y-2 text-sm'>
                  {entry.changes.map((change) => (
                    <div
                      key={`${entry.id}-${change.field}`}
                      className='grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2'
                    >
                      <span className='font-medium text-zinc-600'>{change.field}</span>
                      <div className='text-zinc-700'>
                        <span className='line-through text-zinc-400'>{change.before}</span>
                        <span className='mx-2 text-zinc-300'>-&gt;</span>
                        <span className='font-semibold'>{change.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='text-sm text-zinc-500'>Nessuna modifica registrata.</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
