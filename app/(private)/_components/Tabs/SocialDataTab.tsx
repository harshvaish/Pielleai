import { TabsContent } from '@/components/ui/tabs';
import { ArtistData, VenueData } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { SquareArrowOutUpRight } from 'lucide-react';

export default function SocialDataTab({
  tabValue,
  data,
}: {
  tabValue: string;
  data: ArtistData | VenueData;
}) {
  return (
    <TabsContent value={tabValue}>
      <section className='bg-white overflow-auto rounded-2xl border group-has-[[data-pending]]:animate-pulse'>
        <Table className='w-full'>
          <TableHeader className='bg-zinc-50'>
            <TableRow>
              <TableHead>Social</TableHead>
              <TableHead>Nome profilo</TableHead>
              <TableHead>Numero di followers</TableHead>
              <TableHead>Data di aggiunta</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>
                <div className='flex items-center flex-nowrap gap-3'>
                  <Image
                    className='w-8'
                    src='/images/socials/tiktok.svg'
                    alt='logo tiktok'
                    width={32}
                    height={32}
                  />
                  <span>TikTok</span>
                </div>
              </TableCell>
              <TableCell>
                {data.tiktokUrl && data.tiktokUsername ? (
                  <Link
                    href={data.tiktokUrl}
                    prefetch={false}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-nowrap gap-2 text-blue-600'
                  >
                    @{data.tiktokUsername} <SquareArrowOutUpRight size={16} />
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {data.tiktokFollowers ? data.tiktokFollowers : '-'}
              </TableCell>
              <TableCell>
                {data.tiktokCreatedAt
                  ? format(new Date(data.tiktokCreatedAt), 'dd/MM/yyyy')
                  : '-'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <div className='flex items-center flex-nowrap gap-3'>
                  <Image
                    className='w-8'
                    src='/images/socials/facebook.svg'
                    alt='logo facebook'
                    width={32}
                    height={32}
                  />
                  <span>Facebook</span>
                </div>
              </TableCell>
              <TableCell>
                {data.facebookUrl && data.facebookUsername ? (
                  <Link
                    href={data.facebookUrl}
                    prefetch={false}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-nowrap gap-2 text-blue-600'
                  >
                    @{data.facebookUsername} <SquareArrowOutUpRight size={16} />
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {data.facebookFollowers ? data.facebookFollowers : '-'}
              </TableCell>
              <TableCell>
                {data.facebookCreatedAt
                  ? format(new Date(data.facebookCreatedAt), 'dd/MM/yyyy')
                  : '-'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <div className='flex items-center flex-nowrap gap-3'>
                  <Image
                    className='w-8'
                    src='/images/socials/instagram.svg'
                    alt='logo instagram'
                    width={32}
                    height={32}
                  />
                  <span>Instagram</span>
                </div>
              </TableCell>
              <TableCell>
                {data.instagramUrl && data.instagramUsername ? (
                  <Link
                    href={data.instagramUrl}
                    prefetch={false}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-nowrap gap-2 text-blue-600'
                  >
                    @{data.instagramUsername}{' '}
                    <SquareArrowOutUpRight size={16} />
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {data.instagramFollowers ? data.instagramFollowers : '-'}
              </TableCell>
              <TableCell>
                {data.instagramCreatedAt
                  ? format(new Date(data.instagramCreatedAt), 'dd/MM/yyyy')
                  : '-'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <div className='flex items-center flex-nowrap gap-3'>
                  <Image
                    className='w-8'
                    src='/images/socials/x.svg'
                    alt='logo x'
                    width={32}
                    height={32}
                  />
                  <span>X</span>
                </div>
              </TableCell>
              <TableCell>
                {data.xUrl && data.xUsername ? (
                  <Link
                    href={data.xUrl}
                    prefetch={false}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-nowrap gap-2 text-blue-600'
                  >
                    @{data.xUsername} <SquareArrowOutUpRight size={16} />
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>{data.xFollowers ? data.xFollowers : '-'}</TableCell>
              <TableCell>
                {data.xCreatedAt
                  ? format(new Date(data.xCreatedAt), 'dd/MM/yyyy')
                  : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </TabsContent>
  );
}
