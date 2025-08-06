'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, SquareArrowOutUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import ChangePasswordButton from './ChangePassword/ChangePaswordButton';
import { Separator } from '@/components/ui/separator';
import SignOutButton from './SignOutButton';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAVBAR_LINKS } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NavbarButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { data, isPending } = useSession();

  const user = data?.user;

  useEffect(() => {
    if (!user && !isPending) {
      router.push('/accedi');
    }
  }, [user, isPending, router]);

  if (isPending || !user) return <Skeleton className='w-10 md:w-40 h-10 md:h-12 rounded-md' />;

  if (isMobile)
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            className='w-10 h-10'
          >
            <Menu className='size-5' />
          </Button>
        </SheetTrigger>
        <SheetContent className='px-4 pt-12 pb-4'>
          <SheetTitle className='hidden'>Menu di navigazione a scomparsa</SheetTitle>
          <nav className='max-h-max overflow-y-auto flex flex-col gap-2'>
            {NAVBAR_LINKS.map((link) => (
              <Fragment key={link.label}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className='flex items-center gap-2 text-sm font-medium rounded-xl p-2 hover:bg-zinc-50'
                >
                  <Image
                    className='w-4 h-4'
                    src={link.iconSrc}
                    alt={link.iconAlt}
                    width={16}
                    height={16}
                    loading='lazy'
                  />
                  {link.label}
                </Link>
                {link.separator && <Separator />}
              </Fragment>
            ))}

            <Separator />

            <ChangePasswordButton
              userId={user.id}
              email={user.email}
            />

            <Separator />

            <Link
              href=''
              prefetch={false}
              className='flex items-center gap-2 text-sm text-blue-600 font-medium rounded-xl p-2 hover:bg-zinc-50'
            >
              <SquareArrowOutUpRight className='size-3' />
              Informativa sulla privacy
            </Link>

            <Link
              href=''
              prefetch={false}
              className='flex items-center gap-2 text-sm text-blue-600 font-medium rounded-xl p-2 hover:bg-zinc-50'
            >
              <SquareArrowOutUpRight className='size-3' />
              Termini e Condizioni
            </Link>

            <Separator />

            <SignOutButton />
          </nav>
        </SheetContent>
      </Sheet>
    );

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>
        <div className='w-max max-w-40 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-white p-2 rounded-2xl hover:cursor-pointer transition-colors'>
          <Avatar className='w-8 h-8'>
            <AvatarFallback className='bg-zinc-200'>{user.name.substring(0, 1)}</AvatarFallback>
          </Avatar>

          <span className='text-sm font-semibold truncate text-zinc-700'>{user.name}</span>

          <ChevronDown className={cn('size-4 transition-transform', isOpen ? 'rotate-180' : '')} />
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
