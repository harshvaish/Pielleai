'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AVATAR_FALLBACK } from '@/lib/constants';
import StatusBadge from '@/app/(private)/_components/Badges/StatusBadge';
import { UserStatus } from '@/lib/types';

type ArtistManagerHeaderProps = {
  userId: string;
  name: string;
  surname: string;
  avatarUrl: string | null;
  initialStatus: UserStatus;
};

export default function ArtistManagerHeader({
  userId,
  name,
  surname,
  avatarUrl,
  initialStatus,
}: ArtistManagerHeaderProps) {
  const [status, setStatus] = useState<UserStatus>(initialStatus);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string; status: UserStatus }>;
      if (customEvent.detail?.userId === userId) {
        setStatus(customEvent.detail.status);
      }
    };

    window.addEventListener('user-status-change', handler);
    return () => window.removeEventListener('user-status-change', handler);
  }, [userId]);

  const isDisabled = status === 'disabled';

  return (
    <div className='flex items-center gap-4'>
      <Image
        src={avatarUrl || AVATAR_FALLBACK}
        alt='Icona profilo manager artista'
        width={60}
        height={60}
        className={cn(
          'shrink-0 w-[60px] h-[60px] rounded-full object-cover',
          isDisabled ? 'grayscale' : '',
        )}
      />

      <div className='flex flex-col gap-1.5'>
        <div className='text-2xl font-bold'>
          {name} {surname}
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant={isDisabled ? 'disabled' : 'emerald'}>Manager artista</Badge>
          {isDisabled && <StatusBadge status='disabled' />}
        </div>
      </div>
    </div>
  );
}
