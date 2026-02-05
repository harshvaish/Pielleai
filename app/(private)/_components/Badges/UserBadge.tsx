import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function UserBadge({
  name,
  surname,
  avatarUrl,
  isDisabled,
  href,
  isSmall = false,
  className,
}: {
  name: string;
  surname: string;
  avatarUrl: string;
  isDisabled: boolean;
  href: string;
  isSmall?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        'w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors',
        className,
      )}
    >
      <Avatar className={isSmall ? 'w-4 h-4' : 'w-6 h-6'}>
        <AvatarImage
          src={avatarUrl}
          className={cn(isDisabled ? 'grayscale' : '')}
        />
        <AvatarFallback>{name.substring(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>

      <span
        className={cn(
          'font-semibold truncate',
          isSmall ? 'text-xs' : 'text-sm',
          isDisabled ? 'text-zinc-500' : 'text-zinc-700',
        )}
      >
        {name} {surname}
      </span>
    </Link>
  );
}
