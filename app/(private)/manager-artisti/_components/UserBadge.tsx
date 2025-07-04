import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function UserBadge({
  name,
  surname,
  avatarUrl,
  isDisabled,
  href,
}: {
  name: string;
  surname: string;
  avatarUrl: string;
  isDisabled: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className='w-max flex items-center gap-2 bg-zinc-100 py-1 px-2 rounded-md transition-colors hover:bg-zinc-200'
    >
      <Image
        src={avatarUrl}
        alt='Immagine profilo utente'
        height={24}
        width={24}
        sizes='24px'
        className={cn('w-6 h-6 rounded-full', isDisabled ? 'grayscale' : '')}
      />

      <span
        className={cn(
          'text-sm font-semibold whitespace-nowrap',
          isDisabled ? 'text-zinc-500' : 'text-zinc-700'
        )}
      >
        {name} {surname}
      </span>
    </Link>
  );
}
