import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { cn, hasRole, resolveNextPath } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import UpdateArtistManagerButton from '../manager-artisti/[uid]/_components/update/UpdateButton';
import UpdateVenueManagerButton from '../promoter-locali/[uid]/_components/update/UpdateButton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Ellipsis, SquareArrowOutUpRight } from 'lucide-react';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getArtistManagerCached } from '@/lib/cache/artist-managers';
import getSession from '@/lib/data/auth/get-session';
import { getVenueManagerCached } from '@/lib/cache/venue-managers';
import { ArtistListData, ArtistManagerData, VenueListData, VenueManagerData } from '@/lib/types';
import ManagedArtistsTab from '../manager-artisti/[uid]/_components/Tabs/ManagedArtistsTab';
import ArtistManagerPersonalDataTab from '../manager-artisti/[uid]/_components/Tabs/PersonalDataTab';
import VenueManagerPersonalDataTab from '../promoter-locali/[uid]/_components/Tabs/PersonalDataTab';
import ManagedVenuesTab from '../promoter-locali/[uid]/_components/Tabs/ManagedVenuesTab';
import SignOutTile from './_components/action-tiles/SignOutTile';
import ChangePasswordTile from './_components/action-tiles/ChangePaswordTile';
import { getUserProfileIdCached } from '@/lib/cache/users';
import BillingDataTab from '../_components/Tabs/BillingDataTab';
import DeleteAccountTile from './_components/action-tiles/DeleteAccountTile';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['artist-manager', 'venue-manager'])) {
    notFound();
  }

  const isArtistManager = user.role === 'artist-manager';

  const [userData, languages, countries] = await Promise.all([
    isArtistManager ? getArtistManagerCached(user.id) : getVenueManagerCached(user.id),
    getLanguagesCached(),
    getCountriesCached(),
  ]);

  if (!userData) notFound();

  return (
    <div className='max-w-full overflow-x-hidden'>
      <div className='flex justify-between items-center'>
        <BackButton />

        <Popover>
          <PopoverTrigger className='lg:hidden'>
            <Ellipsis />
          </PopoverTrigger>
          <PopoverContent className='w-48 flex flex-col justify-start lg:hidden'>
            {isArtistManager && (
              <UpdateArtistManagerButton
                userData={userData as ArtistManagerData<ArtistListData>}
                countries={countries}
                languages={languages}
              />
            )}
            {!isArtistManager && (
              <UpdateVenueManagerButton
                userData={userData as VenueManagerData}
                countries={countries}
                languages={languages}
              />
            )}
          </PopoverContent>
        </Popover>

        <div className='hidden lg:flex items-center gap-4'>
          {isArtistManager && (
            <UpdateArtistManagerButton
              userData={userData as ArtistManagerData<ArtistListData>}
              countries={countries}
              languages={languages}
            />
          )}
          {!isArtistManager && (
            <UpdateVenueManagerButton
              userData={userData as VenueManagerData}
              countries={countries}
              languages={languages}
            />
          )}
        </div>
      </div>

      <div className='grid lg:grid-cols-[60%_auto] gap-6 mb-6'>
        {/* main details section */}
        <section className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
          <div className='flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-2'>
            <div className='flex items-center gap-4'>
              <Image
                src={userData.avatarUrl}
                alt='Icona profilo manager artista'
                width={60}
                height={60}
                className={cn('shrink-0 w-[60px] h-[60px] rounded-full object-cover')}
              />

              <div className='flex flex-col gap-1.5'>
                <div className='text-2xl font-bold'>
                  {userData.name} {userData.surname}
                </div>
                <div className='md:hidden flex items-center gap-2'>
                  <Badge variant={isArtistManager ? 'emerald' : 'yellow'}>
                    {isArtistManager ? 'Manager artista' : 'Promoter locali'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className='hidden md:flex items-center gap-2'>
              <Badge variant={isArtistManager ? 'emerald' : 'yellow'}>
                {isArtistManager ? 'Manager artista' : 'Promoter locali'}
              </Badge>
            </div>
          </div>
          <Separator className='my-6' />
          <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-2 lg:gap-6 overflow-x-auto'>
            <span className='text-sm font-semibold text-zinc-600'>Email</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.email}</span>
            <span className='text-sm font-semibold text-zinc-600'>Numero di telefono</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.phone}</span>
            {isArtistManager && (
              <>
                <span className='text-sm font-semibold text-zinc-600'>Indirizzo PEC</span>
                <span className='text-sm font-medium text-zinc-500'>
                  {(userData as ArtistManagerData).billingPec}
                </span>
                <span className='text-sm font-semibold text-zinc-600'>Ragione sociale</span>
                <span className='text-sm font-medium text-zinc-500'>
                  {(userData as ArtistManagerData).company}
                </span>
              </>
            )}
          </div>
        </section>

        {/* action section */}
        <section className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
          <div className='flex justify-between gap-4 px-2 py-3 rounded-md hover:bg-zinc-50 hover:cursor-pointer'>
            <span className='text-sm font-semibold text-zinc-600'>Termini e condizioni</span>
            <SquareArrowOutUpRight className='size-4 stroke-1 text-zinc-700' />
          </div>

          <Separator />

          <div className='flex justify-between gap-4 px-2 py-3 rounded-md hover:bg-zinc-50 hover:cursor-pointer'>
            <span className='text-sm font-semibold text-zinc-600'>Informativa sulla privacy</span>
            <SquareArrowOutUpRight className='size-4 stroke-1 text-zinc-700' />
          </div>

          <Separator />

          <ChangePasswordTile
            userId={user.id}
            email={user.email}
          />

          <Separator />

          <SignOutTile />

          <Separator />

          <DeleteAccountTile />
        </section>
      </div>

      <Tabs defaultValue='a'>
        <div className='flex justify-between items-center mb-2 overflow-hidden'>
          <span className='hidden lg:block text-xl font-semibold'>Dettagli</span>
          <TabsList className='w-full lg:max-w-max justify-start gap-4 bg-white p-1 rounded-xl overflow-x-auto'>
            {isArtistManager ? (
              <>
                <TabsTrigger value='a'>Artisti gestiti</TabsTrigger>
                <TabsTrigger value='b'>Dati di fatturazione</TabsTrigger>
                <TabsTrigger value='c'>Dati personali</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value='a'>Locali gestiti</TabsTrigger>
                <TabsTrigger value='b'>Dati personali</TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        {isArtistManager ? (
          <>
            <ManagedArtistsTab
              tabValue='a'
              data={userData as ArtistManagerData<ArtistListData>}
            />
            <BillingDataTab
              tabValue='b'
              data={userData as ArtistManagerData}
            />
            <ArtistManagerPersonalDataTab
              tabValue='c'
              userData={userData as ArtistManagerData}
            />
          </>
        ) : (
          <>
            <ManagedVenuesTab
              tabValue='a'
              data={userData as VenueManagerData<VenueListData>}
            />
            <VenueManagerPersonalDataTab
              tabValue='b'
              userData={userData as VenueManagerData<VenueListData>}
            />
          </>
        )}
      </Tabs>
    </div>
  );
}
