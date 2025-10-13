'use client';

import { Check, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserToApprove } from '@/lib/types';
import { UserStatus } from '@/lib/types';
import { updateUserStatus } from '@/lib/server-actions/users/update-user-status';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SpinnerLoading } from '@/app/_components/SpinnerLoading';
import { cn } from '@/lib/utils';
import UserRoleBadge from '../../_components/Badges/UserRoleBadge';

type UserToApproveTileProps = {
  user: UserToApprove;
};

export default function UserToApproveTile({ user }: UserToApproveTileProps) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState<null | UserStatus>(null);

  const onClickHandler = async (status: UserStatus) => {
    setLoadingStatus(status);
    const response = await updateUserStatus(user.id, status);

    if (!response.success) {
      toast.error(response.message);
    } else {
      router.refresh();
      toast.success('Status utenza aggiornato!');
    }

    setLoadingStatus(null);
  };

  return (
    <div
      className={cn(
        'md:flex md:justify-between md:items-center gap-2 space-y-4 md:space-y-0 px-2 md:px-4 py-4 md:py-8 border-b border-zinc-100 rounded-2xl transition-colors hover:bg-zinc-50',
        loadingStatus && 'bg-zinc-100',
      )}
    >
      <div className='space-y-2'>
        <div className='flex justify-between md:justify-start items-center gap-4 mb-2'>
          <div className='text-lg font-semibold'>
            {user.name} {user.surname}
          </div>
          <UserRoleBadge role={user.role} />
        </div>
        <div className='flex justify-between md:justify-start items-center gap-4'>
          <div className='flex gap-1 items-center text-xs text-zinc-500 font-medium'>
            <Mail className='size-3' />
            <span>Indirizzo email</span>
          </div>
          <span className='text-xs text-zinc-500 font-medium'>{user.email}</span>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Button
          variant='success'
          size='sm'
          onClick={() => onClickHandler('active')}
          disabled={loadingStatus !== null}
        >
          {loadingStatus === 'active' ? (
            <>
              <SpinnerLoading /> Accetto...
            </>
          ) : (
            <>
              <Check /> Accetta
            </>
          )}
        </Button>
        <Button
          variant='destructive'
          size='sm'
          onClick={() => onClickHandler('disabled')}
          disabled={loadingStatus !== null}
        >
          {loadingStatus === 'disabled' ? (
            <>
              <SpinnerLoading /> Rifiuto...
            </>
          ) : (
            <>
              <X /> Rifiuta
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
