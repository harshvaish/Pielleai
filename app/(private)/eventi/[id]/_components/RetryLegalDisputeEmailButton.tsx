'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { retryLegalDisputeEmail } from '@/lib/server-actions/events/retry-legal-dispute-email';

type RetryLegalDisputeEmailButtonProps = {
  eventId: number;
};

export default function RetryLegalDisputeEmailButton({
  eventId,
}: RetryLegalDisputeEmailButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);

    const response = await retryLegalDisputeEmail(eventId);

    if (!response.success) {
      toast.error(response.message || 'Invio email non riuscito.');
      setLoading(false);
      return;
    }

    toast.success('Email legale inviata.');
    setLoading(false);
    router.refresh();
  };

  return (
    <Button
      variant='outline'
      size='xs'
      onClick={onClick}
      disabled={loading}
    >
      {loading ? 'Invio...' : 'Invia email legale'}
    </Button>
  );
}
