import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getProfileNotes } from '@/lib/data/notes/get-profile-notes';
import { cn, hasRole, resolveNextPath } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import UpdateButton from './_components/update/UpdateButton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BillingDataTab from '../../_components/tabs/BillingDataTab';
import StatusBadge from '../../_components/badges/StatusBadge';
import NotesSection from '../../_components/notes/NotesSection';
import ToggleBlockButton from '../../_components/ToggleBlockButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getArtistManagerCached } from '@/lib/cache/artist-managers';
import ManagedArtistsTab from './_components/Tabs/ManagedArtistsTab';
import PersonalDataTab from './_components/Tabs/PersonalDataTab';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';

type ArtistManagerDetailPageProps = { params: Promise<{ uid: string }> };

export default async function ArtistManagerDetailPage({ params }: ArtistManagerDetailPageProps) {
  const { session, user } = await getSession();
  if (!session || !user) redirect('/accedi');

  if (!hasRole(user, ['admin'])) {
    notFound();
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  const p = await params;
  const { uid } = p;

  const [userData, languages, countries] = await Promise.all([
    getArtistManagerCached(uid),
    getLanguagesCached(),
    getCountriesCached(),
  ]);

  if (!userData) notFound();

  const initialNotesData = await getProfileNotes({
    receiverProfileId: userData.profileId,
  });

  const createdAtZoned = format(toZonedTime(userData.createdAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const updatedAtZoned = format(toZonedTime(userData.updatedAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
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
            <UpdateButton
              userData={userData}
              languages={languages}
              countries={countries}
            />
            <ToggleBlockButton
              userId={userData.id}
              userInitialStatus={userData.status}
            />
          </PopoverContent>
        </Popover>

        <div className='hidden lg:flex items-center gap-4'>
          <ToggleBlockButton
            userId={userData.id}
            userInitialStatus={userData.status}
          />
          <UpdateButton
            userData={userData}
            languages={languages}
            countries={countries}
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
                alt='Icona profilo manager artista'
                width={60}
                height={60}
                className={cn(
                  'shrink-0 w-[60px] h-[60px] rounded-full object-cover',
                  isDisabled ? 'grayscale' : '',
                )}
              />

              <div className='flex flex-col gap-1.5'>
                <div className='text-2xl font-bold'>
                  {userData.name} {userData.surname}
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant={isDisabled ? 'disabled' : 'emerald'}>Manager artista</Badge>
                  {isDisabled && <StatusBadge status='disabled' />}
                </div>
              </div>
            </div>

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
