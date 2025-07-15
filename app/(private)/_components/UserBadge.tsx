import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function UserBadge({
  name,
  surname,
  avatarUrl,
  isDisabled,
  href,
  isSmall = false,
}: {
  name: string;
  surname: string;
  avatarUrl: string;
  isDisabled: boolean;
  href: string;
  isSmall?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className='w-max flex items-center gap-2 bg-zinc-50 p-2 rounded-md transition-colors hover:bg-zinc-100'
    >
      {isSmall ? (
        <Image
          src={avatarUrl}
          alt='Immagine profilo utente'
          height={16}
          width={16}
          sizes='16px'
          className={cn(
            'w-4 h-4 rounded-full object-center object-cover',
            isDisabled ? 'grayscale' : ''
          )}
        />
      ) : (
        <Image
          src={avatarUrl}
          alt='Immagine profilo utente'
          height={24}
          width={24}
          sizes='24px'
          className={cn(
            'w-6 h-6 rounded-full object-center object-cover',
            isDisabled ? 'grayscale' : ''
          )}
        />
      )}

      <span
        className={cn(
          'text-sm font-semibold whitespace-nowrap',
          isSmall ? 'text-xs' : 'text-sm',
          isDisabled ? 'text-zinc-500' : 'text-zinc-700'
        )}
      >
        {name} {surname}
      </span>
    </Link>
  );
}
