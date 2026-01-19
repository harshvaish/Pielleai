import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { cn, hasRole, resolveNextPath } from '@/lib/utils';
import { AVATAR_FALLBACK, TIME_ZONE } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getArtistNotes } from '@/lib/data/notes/get-artist-notes';
import ToggleArtistBlockButton from './_components/ToggleArtistBlockButton';
import EditArtistButton from './_components/update/EditArtistButton';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getZonesCached } from '@/lib/cache/zones';
import { getArtistManagersCached } from '@/lib/cache/artist-managers';
import { getVenuesCached } from '@/lib/cache/venues';
import { getArtistCached } from '@/lib/cache/artists';
import getSession from '@/lib/data/auth/get-session';
import { toast } from 'sonner';
import { ProfileNote } from '@/lib/types';
import { getUserProfileIdCached } from '@/lib/cache/users';
import StatusBadge from '../../_components/Badges/StatusBadge';
import NotesSection from '../../_components/Notes/NotesSection';
import PersonalDataTab from './_components/Tabs/PersonalDataTab';
import BillingDataTab from '../../_components/Tabs/BillingDataTab';
import AvailabilitiesTab from './_components/Tabs/AvailabilitiesTab';
import SocialDataTab from '../../_components/Tabs/SocialDataTab';
import ArtistEventsTab from './_components/Tabs/ArtistEventsTab';
import CreateEventButton from '../../eventi/_components/create/CreateButton';
import CreateArtistManagerButton from '../../manager-artisti/_components/create/CreateButton';
import { getArtistsCached } from '@/lib/cache/artists';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';
import ManageArtistManagersButton from './_components/ManageArtistManagersButton';

type ArtistDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    page?: string;
    status?: string;
    venue?: string;
    start?: string;
    end?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function ArtistDetailPage({ params, searchParams }: ArtistDetailPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'artist-manager'])) {
    notFound();
  }

  const isAdmin = user.role === 'admin';

  const p = await params;
  const { slug } = p;

  const [userData, languages, countries, zones, artistManagers, venues, artists, moCoordinators] =
    await Promise.all([
      getArtistCached(slug),
      getLanguagesCached(),
      getCountriesCached(),
      getZonesCached(),
      getArtistManagersCached(),
      getVenuesCached(),
      isAdmin ? getArtistsCached() : Promise.resolve([]),
      isAdmin ? getMoCoordinatorsCached() : Promise.resolve([]),
    ]);

  if (!userData) notFound();

  let initialNotesData: ProfileNote[] = [];

  if (isAdmin) {
    const noteResponse = await getArtistNotes({
      artistId: userData.id,
    });

    if (!noteResponse.success) {
      toast.error(noteResponse.message || 'Recupero note non riuscito.');
      return;
    }

    initialNotesData = noteResponse.data;
  }

  const isDisabled = userData.status === 'disabled';
  const createdAtZoned = format(toZonedTime(userData.createdAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const updatedAtZoned = format(toZonedTime(userData.updatedAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');

  const sp = searchParams ? await searchParams : {};

  return (
    <div className='max-w-full overflow-x-hidden'>
      <div className='flex justify-between items-center'>
        <BackButton />
      </div>

      <div className={cn('mb-6', isAdmin && 'grid lg:grid-cols-[60%_auto] gap-6 ')}>
        {/* main details section */}
        <section className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
          <div className='flex flex-col xl:flex-row xl:justify-between gap-4 lg:gap-2 mb-4'>
            <div className='flex items-center gap-4'>
              <Image
                src={userData.avatarUrl || AVATAR_FALLBACK}
                alt='Icona profilo artista'
                width={60}
                height={60}
                className={cn(
                  'shrink-0 w-[60px] h-[60px] rounded-full object-cover',
                  isDisabled ? 'grayscale' : '',
                )}
              />

              <div className='flex flex-col'>
                <div className='text-2xl font-bold'>
                  {userData.name} {userData.surname}
                </div>
                <div className='font-medium text-zinc-500 mb-2'>@{userData.stageName}</div>
                <div className='flex items-center gap-2'>
                  <Badge variant={isDisabled ? 'disabled' : 'orange'}>Artista</Badge>
                  {isDisabled && <StatusBadge status='disabled' />}
                </div>
              </div>
            </div>

            <div className='max-w-full flex flex-col xl:items-end gap-0.5 overflow-x-auto'>
              <div className='flex flex-col lg:flex-row text-sm font-semibold text-zinc-500 whitespace-nowrap'>
                ID: {userData.id}
              </div>
              <div className='text-xs font-semibold text-zinc-400'>
                Data di creazione {createdAtZoned}
              </div>
              <div className='text-xs font-semibold text-zinc-400'>
                Data di aggiornamento {updatedAtZoned}
              </div>
            </div>
          </div>

          <div className='text-xs font-medium text-zinc-500'>{userData.bio}</div>

          <Separator className='my-6' />

          <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-2 lg:gap-6 overflow-x-auto'>
            <span className='text-sm font-semibold text-zinc-600'>Email</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.email}</span>
            <span className='text-sm font-semibold text-zinc-600'>Numero di telefono</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.phone}</span>
            {userData.billingPec && (
              <>
                <span className='text-sm font-semibold text-zinc-600'>Indirizzo PEC</span>
                <span className='text-sm font-medium text-zinc-500'>{userData.billingPec}</span>
              </>
            )}
            {userData.company && (
              <>
                <span className='text-sm font-semibold text-zinc-600'>Ragione sociale</span>
                <span className='text-sm font-medium text-zinc-500'>{userData.company}</span>
              </>
            )}
          </div>
        </section>

        {isAdmin && (
          <section className='bg-white py-6 px-6 rounded-2xl'>
            <div className='text-lg font-semibold mb-4'>Azioni rapide</div>
            <div className='flex flex-wrap gap-2'>
              <CreateEventButton
                userRole={user.role}
                artists={artists}
                venues={venues}
                moCoordinators={moCoordinators}
                forceLink={true}
                buttonLabel='Crea evento'
                buttonVariant='outline'
                buttonSize='sm'
              />
              <CreateArtistManagerButton
                languages={languages}
                countries={countries}
                buttonLabel='Crea manager artista'
                buttonVariant='outline'
                buttonSize='sm'
              />
              <ManageArtistManagersButton
                artistId={userData.id}
                artistManagers={artistManagers}
                initialManagerIds={userData.managers.map((manager) => manager.profileId)}
              />
              <EditArtistButton
                userRole={user.role}
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
            </div>
          </section>
        )}
      </div>

      {isAdmin && (
        <div className='mb-6'>
          <NotesSection
            isArtist={true}
            initialNotes={initialNotesData}
            writerId={user.id}
            receiverProfileId={userData.id}
          />
        </div>
      )}

      {!isAdmin && hasRole(user, ['admin', 'artist-manager']) && (
        <section className='bg-white py-6 px-6 rounded-2xl mb-6'>
          <div className='text-lg font-semibold mb-4'>Azioni rapide</div>
          <div className='flex flex-wrap gap-2'>
            <ManageArtistManagersButton
              artistId={userData.id}
              artistManagers={artistManagers}
              initialManagerIds={userData.managers.map((manager) => manager.profileId)}
            />
            <EditArtistButton
              userRole={user.role}
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
          </div>
        </section>
      )}

      <Tabs defaultValue='a'>
        <div className='flex justify-between items-center mb-2 overflow-hidden'>
          <span className='hidden lg:block text-xl font-semibold'>Dettagli</span>
          <TabsList className='w-full lg:max-w-max justify-start gap-4 bg-white p-1 rounded-xl overflow-x-auto'>
            <TabsTrigger value='a'>Dati personali</TabsTrigger>
            <TabsTrigger value='b'>Dati di fatturazione</TabsTrigger>
            <TabsTrigger value='c'>Disponibilità</TabsTrigger>
            <TabsTrigger value='d'>Social</TabsTrigger>
            <TabsTrigger value='e'>Eventi</TabsTrigger>
          </TabsList>
        </div>

        <PersonalDataTab
          tabValue='a'
          data={userData}
          userRole={user.role}
        />
        <BillingDataTab
          tabValue='b'
          data={userData}
        />
        <AvailabilitiesTab
          tabValue='c'
          userRole={user.role}
        />
        <SocialDataTab
          tabValue='d'
          data={userData}
        />
        <ArtistEventsTab
          tabValue='e'
          artistId={userData.id}
          venues={venues}
          searchParams={sp ?? {}}
        />
      </Tabs>
    </div>
  );
}
