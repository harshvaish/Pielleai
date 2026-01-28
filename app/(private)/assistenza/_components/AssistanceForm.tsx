'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type AssistanceFormProps = {
  supportEmail: string;
  userName: string;
  userEmail: string | null;
  userRole: string;
};

const ROLE_LABELS: Record<string, string> = {
  'artist-manager': 'Manager Artista',
  'venue-manager': 'Promoter Locale',
};

export default function AssistanceForm({
  supportEmail,
  userName,
  userEmail,
  userRole,
}: AssistanceFormProps) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const roleLabel = ROLE_LABELS[userRole] ?? userRole;
  const formattedTimestamp = useMemo(
    () =>
      new Intl.DateTimeFormat('it-IT', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Rome',
      }).format(new Date()),
    [],
  );

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error('Inserisci un messaggio.');
      return;
    }

    if (!supportEmail) {
      setStatus('error');
      toast.error('Email di supporto non configurata.');
      return;
    }

    const subject = 'Richiesta assistenza';
    const body = [
      'Nuova richiesta assistenza',
      '',
      `Utente: ${userName}`,
      `Ruolo: ${roleLabel}`,
      `Email: ${userEmail ?? '-'}`,
      `Data: ${formattedTimestamp}`,
      '',
      'Messaggio:',
      trimmed,
    ].join('\n');

    const mailto = `mailto:${encodeURIComponent(supportEmail)}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    try {
      window.location.href = mailto;
      setStatus('success');
      setMessage('');
    } catch {
      setStatus('error');
      toast.error('Impossibile aprire il client email. Riprova.');
    }
  };

  return (
    <div className='space-y-4'>
      {status === 'success' && (
        <div className='rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 text-sm'>
          La tua richiesta è stata inviata. Ti contatteremo al più presto.
        </div>
      )}
      {status === 'error' && (
        <div className='rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm'>
          C&apos;è stato un problema nell&apos;invio della richiesta. Riprova più tardi.
        </div>
      )}

      <div className='space-y-2'>
        <div className='text-sm font-semibold'>Messaggio</div>
        <Textarea
          placeholder='Enter your message'
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (status !== 'idle') setStatus('idle');
          }}
          className='min-h-[140px]'
          required
        />
      </div>

      <Button onClick={handleSubmit}>
        Send
      </Button>
    </div>
  );
}
