import { ArtistTableData } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

type ArtistCardProps = {
  artist: ArtistTableData;
};

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className='grid grid-cols-[max-content_1fr] gap-4'>
      <Image
        src={artist.avatarUrl}
        alt={`Immagine profilo di ${artist.stageName}`}
        width={240}
        height={312}
        className='w-[150px] md:w-[200px] lg:w-[240px] aspect-[1/1.3] object-cover bg-white rounded-xl'
      />
      <div className='flex flex-col gap-4'>
        <div className='text-xl font-bold'>{artist.stageName}</div>
        <div className='text-xs font-medium text-zinc-500'>{artist.bio}</div>

        <div className='flex items-center gap-2'>
          {artist.tiktokUrl && (
            <Link
              href={artist.tiktokUrl}
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
          {artist.facebookUrl && (
            <Link
              href={artist.facebookUrl}
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
          {artist.instagramUrl && (
            <Link
              href={artist.instagramUrl}
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
          {artist.xUrl && (
            <Link
              href={artist.xUrl}
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
