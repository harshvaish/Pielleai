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
                  <Link href={userData.facebookUrl}>
                    {userData.facebookUsername}
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
                {userData.facebookCreatedAt ? userData.facebookCreatedAt : '-'}
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
                  <Link href={userData.instagramUrl}>
                    {userData.instagramUsername}
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
                  ? userData.instagramCreatedAt
                  : '-'}
              </TableCell>
            </TableRow>

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
                  <Link href={userData.tiktokUrl}>
                    {userData.tiktokUsername}
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
                {userData.tiktokCreatedAt ? userData.tiktokCreatedAt : '-'}
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
                  <Link href={userData.xUrl}>{userData.xUsername}</Link>
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
                {userData.xCreatedAt ? userData.xCreatedAt : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </TabsContent>
  );
}
