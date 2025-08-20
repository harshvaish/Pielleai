'use client';

import { Button } from '@/components/ui/button';
import { deleteManagedVenue } from '@/lib/server-actions/venue-managers/delete-managed-venue';
import { CircleMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type RemoveManagedVenueButtonProps = {
  managerProfileId: number;
  venueId: number;
};

export default function RemoveManagedVenueButton({ managerProfileId, venueId }: RemoveManagedVenueButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onClickHandler = async () => {
    setLoading(true);

    const response = await deleteManagedVenue({ managerProfileId, venueId });

    if (response.success) {
      toast.success('Locale gestito rimosso!');
      router.refresh();
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  return (
    <Button
      role='button'
      variant='ghost'
      size='icon'
      className='text-destructive'
      onClick={onClickHandler}
      disabled={loading}
    >
      <CircleMinus className={loading ? 'animate-spin' : ''} />
    </Button>
  );
}
