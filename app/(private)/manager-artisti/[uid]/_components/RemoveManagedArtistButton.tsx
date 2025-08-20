'use client';

import { Button } from '@/components/ui/button';
import { removeManagedArtist } from '@/lib/server-actions/artist-managers/remove-managed-artist';
import { CircleMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type RemoveManagedArtistButtonProps = {
  managerProfileId: number;
  artistId: number;
};

export default function RemoveManagedArtistButton({ managerProfileId, artistId }: RemoveManagedArtistButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onClickHandler = async () => {
    setLoading(true);

    const response = await removeManagedArtist({ managerProfileId, artistId });

    if (response.success) {
      toast.success('Artista gestito rimosso!');
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
