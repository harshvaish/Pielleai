'use client';

import { NavbarLink as LinkType } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavbarLinkProps = {
  link: LinkType;
};

export default function NavbarLink({ link }: NavbarLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      key={link.label}
      href={link.href}
      prefetch={false}
      className={cn(
        'flex items-center gap-2 text-sm md:text-base font-medium md:font-normal rounded-xl p-2 hover:bg-zinc-50',
        pathname === link.href && 'bg-zinc-100 pointer-events-none cursor-pointer',
      )}
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
  );
}
