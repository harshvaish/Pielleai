'use client';

import { Button } from '@/components/ui/button';
import { deleteManagedVenue } from '@/lib/server-actions/venue-managers/delete-managed-venue';
import { CircleMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RemoveManagedVenueButton({
  managerProfileId,
  venueId,
}: {
  managerProfileId: number;
  venueId: number;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickHandler = async () => {
    setIsLoading(true);

    const response = await deleteManagedVenue({ managerProfileId, venueId });

    if (response.success) {
      toast.success('Locale gestito rimosso!');
      router.refresh();
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  return (
    <Button
      role='button'
      variant='ghost'
      size='icon'
      className='text-destructive'
      onClick={onClickHandler}
      disabled={isLoading}
    >
      <CircleMinus className={isLoading ? 'animate-spin' : ''} />
    </Button>
  );
}
