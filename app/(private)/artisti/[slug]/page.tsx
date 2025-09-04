import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { cn, hasRole, resolveNextPath } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '../../_components/badges/StatusBadge';
import { getArtistNotes } from '@/lib/data/notes/get-artist-notes';
import ToggleArtistBlockButton from './_components/ToggleArtistBlockButton';
import EditArtistButton from './_components/update/EditArtistButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getZonesCached } from '@/lib/cache/zones';
import { getArtistManagersCached } from '@/lib/cache/artist-managers';
import { getArtistCached } from '@/lib/cache/artists';
import NotesSection from '../../_components/notes/NotesSection';
import PersonalDataTab from './_components/tabs/PersonalDataTab';
import BillingDataTab from '../../_components/tabs/BillingDataTab';
import AvailabilitiesTab from './_components/tabs/AvailabilitiesTab';
import SocialDataTab from '../../_components/tabs/SocialDataTab';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';

type ArtistDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const { session, user } = await getSession();
  if (!session || !user) redirect('/accedi');

  if (!hasRole(user, ['admin', 'artist-manager', 'venue-manager'])) {
    notFound();
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  const p = await params;
  const { slug } = p;

  const [userData, languages, countries, zones, artistManagers] = await Promise.all([
    getArtistCached(slug),
    getLanguagesCached(),
    getCountriesCached(),
    getZonesCached(),
    getArtistManagersCached(),
  ]);

  if (!userData) notFound();

  const initialNotesData = await getArtistNotes({
    artistId: userData.id,
  });

  const isDisabled = userData.status === 'disabled';

  return (
    <div className='max-w-full overflow-x-hidden'>
      <div className='flex justify-between items-center'>
        <BackButton />

        <Popover>
          <PopoverTrigger className='lg:hidden'>
            <Ellipsis />
          </PopoverTrigger>
          <PopoverContent className='w-48 flex flex-col justify-start lg:hidden'>
            <EditArtistButton
              userData={userData}
              languages={languages}
              countries={countries}
              zones={zones}
              artistManagers={artistManagers}
            />
            <ToggleArtistBlockButton
              artistId={userData.id}
              initialStatus={userData.status}
            />
          </PopoverContent>
        </Popover>

        <div className='hidden lg:flex items-center gap-4'>
          <ToggleArtistBlockButton
            artistId={userData.id}
            initialStatus={userData.status}
          />
          <EditArtistButton
            userData={userData}
            languages={languages}
            countries={countries}
            zones={zones}
            artistManagers={artistManagers}
          />
        </div>
      </div>

      <div className='grid lg:grid-cols-[60%_auto] gap-6 mb-6'>
        {/* main details section */}
        <section className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
          <div className='flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-2'>
            <div className='flex items-center gap-4'>
              <Image
                src={userData.avatarUrl}
                alt='Icona profilo artista'
                width={60}
                height={60}
                className={cn(
                  'shrink-0 w-[60px] h-[60px] rounded-full object-cover',
                  isDisabled ? 'grayscale' : '',
                )}
              />

              <div className='flex flex-col'>
                <div className='text-2xl font-bold line-clamp-1'>
                  {userData.name} {userData.surname}
                </div>
                <div className='font-medium text-zinc-500 line-clamp-1 mb-2'>
                  @{userData.stageName}
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant={isDisabled ? 'disabled' : 'orange'}>Artista</Badge>
                  {isDisabled && <StatusBadge status='disabled' />}
                </div>
              </div>
            </div>

            <div className='max-w-full flex flex-col lg:items-end gap-0.5 overflow-x-auto'>
              <div className='flex flex-col lg:flex-row text-sm font-semibold text-zinc-500 whitespace-nowrap'>
                ID: {userData.id}
              </div>
              <div className='text-xs font-semibold text-zinc-400'>
                Data di creazione {format(userData.createdAt, 'dd/MM/yyyy, HH:mm')}
              </div>
              <div className='text-xs font-semibold text-zinc-400'>
                Data di aggiornamento {format(userData.updatedAt, 'dd/MM/yyyy, HH:mm')}
              </div>
            </div>
          </div>
          <Separator className='my-6' />
          <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-2 lg:gap-6 overflow-x-auto'>
            <span className='text-sm font-semibold text-zinc-600'>Email</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.email}</span>
            <span className='text-sm font-semibold text-zinc-600'>Numero di telefono</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.phone}</span>
            <span className='text-sm font-semibold text-zinc-600'>Indirizzo PEC</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.billingPec}</span>
            <span className='text-sm font-semibold text-zinc-600'>Ragione sociale</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.company}</span>
          </div>
        </section>

        <NotesSection
          isArtist={true}
          initialNotes={initialNotesData.data || []}
          writerId={user.id}
          receiverProfileId={userData.id}
        />
      </div>

      <Tabs defaultValue='a'>
        <div className='flex justify-between items-center mb-2 overflow-hidden'>
          <span className='hidden lg:block text-xl font-semibold'>Dettagli</span>
          <TabsList className='w-full lg:max-w-max justify-start gap-4 bg-white p-1 rounded-xl overflow-x-auto'>
            <TabsTrigger value='a'>Dati personali</TabsTrigger>
            <TabsTrigger value='b'>Dati di fatturazione</TabsTrigger>
            <TabsTrigger value='c'>Disponibilità</TabsTrigger>
            <TabsTrigger value='d'>Social</TabsTrigger>
          </TabsList>
        </div>

        <PersonalDataTab
          tabValue='a'
          userData={userData}
        />
        <BillingDataTab
          tabValue='b'
          data={userData}
        />
        <AvailabilitiesTab tabValue='c' />
        <SocialDataTab
          tabValue='d'
          data={userData}
        />
      </Tabs>
    </div>
  );
}
