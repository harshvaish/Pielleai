import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { notFound, redirect } from 'next/navigation';
import { getProfileNotes } from '@/lib/data/notes/get-profile-notes';
import { hasRole, resolveNextPath } from '@/lib/utils';
import UpdateButton from './_components/update/UpdateButton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToggleBlockButton from '../../_components/ToggleBlockButton';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getArtistManagerCached } from '@/lib/cache/artist-managers';
import ManagedArtistsTab from './_components/Tabs/ManagedArtistsTab';
import PersonalDataTab from './_components/Tabs/PersonalDataTab';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import ArtistManagerHeader from './_components/ArtistManagerHeader';
import NotesSection from '../../_components/Notes/NotesSection';
import BillingDataTab from '../../_components/Tabs/BillingDataTab';
import CreateEventButton from '../../eventi/_components/create/CreateButton';
import CreateArtistButton from '../../artisti/_components/create/CreateButton';
import { getArtistsCached } from '@/lib/cache/artists';
import { getVenuesCached } from '@/lib/cache/venues';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';
import { getZonesCached } from '@/lib/cache/zones';
import { getArtistManagersCached } from '@/lib/cache/artist-managers';
import ManageArtistsButton from './_components/ManageArtistsButton';

type ArtistManagerDetailPageProps = { params: Promise<{ uid: string }> };

export default async function ArtistManagerDetailPage({ params }: ArtistManagerDetailPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin'])) {
    notFound();
  }

  const p = await params;
  const { uid } = p;

  const [
    userData,
    languages,
    countries,
    artists,
    venues,
    moCoordinators,
    zones,
    artistManagers,
  ] = await Promise.all([
    getArtistManagerCached(uid),
    getLanguagesCached(),
    getCountriesCached(),
    getArtistsCached(),
    getVenuesCached(),
    getMoCoordinatorsCached(),
    getZonesCached(),
    getArtistManagersCached(),
  ]);

  if (!userData) notFound();

  const initialNotesData = await getProfileNotes({
    receiverProfileId: userData.profileId,
  });

  const createdAtZoned = format(toZonedTime(userData.createdAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const updatedAtZoned = format(toZonedTime(userData.updatedAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  return (
    <div className='max-w-full overflow-x-hidden'>
      <div className='flex justify-between items-center'>
        <BackButton />
      </div>

      <div className='grid lg:grid-cols-[60%_auto] gap-6 mb-6'>
        {/* main details section */}
        <section className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
          <div className='flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-2'>
            <ArtistManagerHeader
              userId={userData.id}
              name={userData.name}
              surname={userData.surname}
              avatarUrl={userData.avatarUrl}
              initialStatus={userData.status}
            />

            <div className='max-w-full flex flex-col lg:items-end gap-0.5 overflow-x-auto'>
              <div className='flex flex-col lg:flex-row text-sm font-semibold text-zinc-500 whitespace-nowrap'>
                ID {userData.id}
              </div>
              <div className='text-xs font-semibold text-zinc-400'>
                Data di creazione: {createdAtZoned}
              </div>
              <div className='text-xs font-semibold text-zinc-400'>
                Data di aggiornamento: {updatedAtZoned}
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

        <section className='bg-white py-6 px-6 rounded-2xl'>
          <div className='text-lg font-semibold mb-4'>Azioni rapide</div>
          <div className='flex flex-wrap gap-2'>
            <CreateEventButton
              userRole={user.role}
              artists={artists}
              venues={venues}
              moCoordinators={moCoordinators}
              buttonLabel='Crea evento'
              buttonVariant='outline'
              buttonSize='sm'
            />
            <CreateArtistButton
              userRole={user.role}
              userProfileId={profileId as number}
              languages={languages}
              countries={countries}
              zones={zones}
              artistManagers={artistManagers}
              buttonLabel='Crea artista'
              buttonVariant='outline'
              buttonSize='sm'
            />
            <ManageArtistsButton
              managerProfileId={userData.profileId}
              artists={artists}
              initialArtistIds={userData.artists.map((artist) => artist.id)}
            />
            <UpdateButton
              userData={userData}
              languages={languages}
              countries={countries}
            />
            <ToggleBlockButton
              userId={userData.id}
              userInitialStatus={userData.status}
            />
          </div>
        </section>
      </div>

      <div className='mb-6'>
        <NotesSection
          isArtist={false}
          initialNotes={initialNotesData.data || []}
          writerId={user.id}
          receiverProfileId={userData.profileId}
        />
      </div>

      <Tabs defaultValue='a'>
        <div className='flex justify-between items-center mb-2 overflow-hidden'>
          <span className='hidden lg:block text-xl font-semibold'>Dettagli</span>
          <TabsList className='w-full lg:max-w-max justify-start gap-4 bg-white p-1 rounded-xl overflow-x-auto'>
            <TabsTrigger value='a'>Artisti gestiti</TabsTrigger>
            <TabsTrigger value='b'>Dati di fatturazione</TabsTrigger>
            <TabsTrigger value='c'>Dati personali</TabsTrigger>
          </TabsList>
        </div>

        <ManagedArtistsTab
          tabValue='a'
          data={userData}
        />
        <BillingDataTab
          tabValue='b'
          data={userData}
        />
        <PersonalDataTab
          tabValue='c'
          userData={userData}
        />
      </Tabs>
    </div>
  );
}
