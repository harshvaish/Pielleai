'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { ChevronDown, SquareArrowOutUpRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import ChangePasswordButton from './ChangePassword/ChangePaswordButton';
import { Separator } from '@/components/ui/separator';
import SignOutButton from './SignOutButton';

export default function UserButton() {
  const { data, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const user = data?.user;

  if (isPending) return <Skeleton className='w-40 h-12 rounded-md' />;
  if (!user) return redirect('/accedi');

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>
        <div className='w-max max-w-40 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-white p-2 rounded-2xl hover:cursor-pointer transition-colors'>
          <Avatar className='w-8 h-8'>
            <AvatarFallback className='bg-zinc-200'>
              {user.name.substring(0, 1)}
            </AvatarFallback>
          </Avatar>

          <span className='text-sm font-semibold truncate text-zinc-700'>
            {user.name}
          </span>

          <ChevronDown
            className={cn(
              'size-4 transition-transform',
              isOpen ? 'rotate-180' : ''
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className='p-1 rounded-2xl'
        align='end'
      >
        <ChangePasswordButton
          userId={user.id}
          email={user.email}
        />

        <Separator />

        <div className='flex items-center gap-2 text-sm text-blue-700 font-medium p-2 transition-colors rounded-md hover:bg-zinc-50 hover:cursor-pointer'>
          <SquareArrowOutUpRight className='size-3' /> Informativa sulla privacy
        </div>

        <div className='flex items-center gap-2 text-sm text-blue-700 font-medium p-2 transition-colors rounded-md hover:bg-zinc-50 hover:cursor-pointer'>
          <SquareArrowOutUpRight className='size-3' /> Termini e Condizioni
        </div>

        <Separator />

        <SignOutButton />
      </PopoverContent>
    </Popover>
  );
}
