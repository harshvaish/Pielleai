'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type SyncContractButtonProps = {
  contractId: number;
  envelopeId: string | null;
  eventId: number;
};

export default function SyncContractButton({
  contractId,
  envelopeId,
  eventId,
}: SyncContractButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    if (!envelopeId) {
      toast.error('No envelope ID found');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/contract/sync-docusign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, envelopeId, eventId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Contract synced successfully');
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to sync contract');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync contract');
    } finally {
      setIsLoading(false);
    }
  };

  if (!envelopeId) return null;

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      Sync DocuSign Status
    </Button>
  );
}
