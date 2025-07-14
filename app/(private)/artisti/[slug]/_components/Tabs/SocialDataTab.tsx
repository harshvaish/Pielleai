import { TabsContent } from '@/components/ui/tabs';
import { ArtistsData } from '@/lib/types';
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
  userData,
}: {
  tabValue: string;
  userData: ArtistsData;
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
                {userData.tiktokUrl && userData.tiktokUsername ? (
                  <Link
                    href={userData.tiktokUrl}
                    prefetch={false}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-nowrap gap-2 text-blue-600'
                  >
                    @{userData.tiktokUsername}{' '}
                    <SquareArrowOutUpRight size={16} />
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {userData.tiktokFollowers ? userData.tiktokFollowers : '-'}
              </TableCell>
              <TableCell>
                {userData.tiktokCreatedAt
                  ? format(new Date(userData.tiktokCreatedAt), 'dd/MM/yyyy')
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
                {userData.facebookUrl && userData.facebookUsername ? (
                  <Link
                    href={userData.facebookUrl}
                    prefetch={false}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-nowrap gap-2 text-blue-600'
                  >
                    @{userData.facebookUsername}{' '}
                    <SquareArrowOutUpRight size={16} />
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {userData.facebookFollowers ? userData.facebookFollowers : '-'}
              </TableCell>
              <TableCell>
                {userData.facebookCreatedAt
                  ? format(new Date(userData.facebookCreatedAt), 'dd/MM/yyyy')
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
                {userData.instagramUrl && userData.instagramUsername ? (
                  <Link
                    href={userData.instagramUrl}
                    prefetch={false}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-nowrap gap-2 text-blue-600'
                  >
                    @{userData.instagramUsername}{' '}
                    <SquareArrowOutUpRight size={16} />
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {userData.instagramFollowers
                  ? userData.instagramFollowers
                  : '-'}
              </TableCell>
              <TableCell>
                {userData.instagramCreatedAt
                  ? format(new Date(userData.instagramCreatedAt), 'dd/MM/yyyy')
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
                {userData.xUrl && userData.xUsername ? (
                  <Link
                    href={userData.xUrl}
                    prefetch={false}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-nowrap gap-2 text-blue-600'
                  >
                    @{userData.xUsername} <SquareArrowOutUpRight size={16} />
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {userData.xFollowers ? userData.xFollowers : '-'}
              </TableCell>
              <TableCell>
                {userData.xCreatedAt
                  ? format(new Date(userData.xCreatedAt), 'dd/MM/yyyy')
                  : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </TabsContent>
  );
}
