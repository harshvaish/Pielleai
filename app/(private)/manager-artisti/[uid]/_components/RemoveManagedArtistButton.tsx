'use client';

import { Button } from '@/components/ui/button';
import { removeManagedArtist } from '@/lib/server-actions/artist-managers/remove-managed-artist';
import { CircleMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RemoveManagedArtistButton({
  managerProfileId,
  artistId,
}: {
  managerProfileId: number;
  artistId: number;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickHandler = async () => {
    setIsLoading(true);

    const response = await removeManagedArtist({ managerProfileId, artistId });

    if (response.success) {
      toast.success('Artista gestito rimosso!');
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
