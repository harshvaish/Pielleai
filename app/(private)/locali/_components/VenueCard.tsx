import { VenueTableData } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

type VenueCardProps = {
  venue: VenueTableData;
};

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className='grid grid-cols-[max-content_1fr] gap-4'>
      <Image
        src={venue.avatarUrl}
        alt={`Immagine locale ${venue.name}`}
        width={240}
        height={312}
        className='w-[240px] aspect-[1/1.3] object-cover bg-white rounded-xl'
      />
      <div className='flex flex-col gap-4'>
        <div className='text-xl font-bold'>{venue.name}</div>
        <div className='text-xs font-medium text-zinc-500'>{venue.bio}</div>

        <div className='flex items-center gap-2'>
          {venue.tiktokUrl && (
            <Link
              href={venue.tiktokUrl}
              prefetch={false}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='w-8 h-8'
                src='/images/socials/tiktok.svg'
                alt='logo TikTok'
                width={32}
                height={32}
              />
            </Link>
          )}
          {venue.facebookUrl && (
            <Link
              href={venue.facebookUrl}
              prefetch={false}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='w-8 h-8'
                src='/images/socials/facebook.svg'
                alt='logo Facebook'
                width={32}
                height={32}
              />
            </Link>
          )}
          {venue.instagramUrl && (
            <Link
              href={venue.instagramUrl}
              prefetch={false}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='w-8 h-8'
                src='/images/socials/instagram.svg'
                alt='logo Instagram'
                width={32}
                height={32}
              />
            </Link>
          )}
          {venue.xUrl && (
            <Link
              href={venue.xUrl}
              prefetch={false}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='w-8 h-8'
                src='/images/socials/x.svg'
                alt='logo X Twitter'
                width={32}
                height={32}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
