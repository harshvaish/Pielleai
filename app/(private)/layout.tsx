import Header from '../_components/Header';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Fragment } from 'react';
import Link from 'next/link';
import { NAVBAR_LINKS } from '@/lib/constants';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className='flex-grow grid md:grid-cols-[max-content_1fr] md:gap-8 p-4 md:p-8 overflow-hidden'>
        {/* sidebar */}
        <nav className='hidden w-60 max-h-max md:flex flex-col gap-1 bg-white p-4 rounded-2xl'>
          {NAVBAR_LINKS.map((link) => (
            <Fragment key={link.label}>
              <Link
                href={link.href}
                prefetch={false}
                className='flex items-center gap-2 rounded-xl p-2 hover:bg-zinc-100'
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
        </nav>
        <main className='flex flex-col gap-3 md:gap-6 overflow-y-auto'>{children}</main>
      </div>
    </>
  );
}
