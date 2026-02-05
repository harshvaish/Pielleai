'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Checkbox } from '@/components/ui/checkbox';
import { updateCancellationAccountingStatus } from '@/lib/server-actions/events/update-cancellation-accounting';

type CancellationAccountingToggleProps = {
  eventId: number;
  initialCompleted: boolean;
  disabled?: boolean;
};

export default function CancellationAccountingToggle({
  eventId,
  initialCompleted,
  disabled = false,
}: CancellationAccountingToggleProps) {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean>(initialCompleted);
  const [loading, setLoading] = useState(false);

  const onChange = async (value: boolean) => {
    if (loading) return;
    const previous = checked;
    setChecked(value);
    setLoading(true);

    const response = await updateCancellationAccountingStatus(eventId, value);

    if (!response.success) {
      setChecked(previous);
      toast.error(response.message || 'Aggiornamento non riuscito.');
      setLoading(false);
      return;
    }

    toast.success('Aggiornamento contabile salvato.');
    setLoading(false);
    router.refresh();
  };

  return (
    <Checkbox
      checked={checked}
      disabled={disabled || loading}
      onCheckedChange={(value) => onChange(Boolean(value))}
    />
  );
}
