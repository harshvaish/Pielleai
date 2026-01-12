import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getProfileNotes } from '@/lib/data/notes/get-profile-notes';
import { cn, hasRole, resolveNextPath } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToggleBlockButton from '../../_components/ToggleBlockButton';
import UpdateButton from './_components/update/UpdateButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getVenueManagerCached } from '@/lib/cache/venue-managers';
import ManagedVenuesTab from './_components/Tabs/ManagedVenuesTab';
import PersonalDataTab from './_components/Tabs/PersonalDataTab';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import StatusBadge from '../../_components/Badges/StatusBadge';
import NotesSection from '../../_components/Notes/NotesSection';
import { AVATAR_FALLBACK, TIME_ZONE } from '@/lib/constants';

type VenueManagerDetailPageProps = { params: Promise<{ uid: string }> };

export const dynamic = 'force-dynamic';

export default async function VenueManagerDetailPage({ params }: VenueManagerDetailPageProps) {
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

  const [userData, languages, countries] = await Promise.all([
    getVenueManagerCached(uid),
    getLanguagesCached(),
    getCountriesCached(),
  ]);

  if (!userData) notFound();

  const initialNotesData = await getProfileNotes({
    receiverProfileId: userData.profileId,
  });

  const isDisabled = userData.status === 'disabled';
  const createdAtZoned = format(toZonedTime(userData.createdAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const updatedAtZoned = format(toZonedTime(userData.updatedAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');

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
                src={userData.avatarUrl || AVATAR_FALLBACK}
                alt='Icona profilo promoter locali'
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
                  <Badge variant={isDisabled ? 'disabled' : 'yellow'}>Promoter locali</Badge>
                  {isDisabled && <StatusBadge status='disabled' />}
                </div>
              </div>
            </div>

            <div className='max-w-full flex flex-col lg:items-end gap-0.5 overflow-x-auto'>
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
          <Separator className='my-6' />
          <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-2 lg:gap-6 overflow-x-auto'>
            <span className='text-sm font-semibold text-zinc-600'>Email</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.email}</span>
            <span className='text-sm font-semibold text-zinc-600'>Numero di telefono</span>
            <span className='text-sm font-medium text-zinc-500'>{userData.phone}</span>
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
            <TabsTrigger value='a'>Locali gestiti</TabsTrigger>
            <TabsTrigger value='b'>Dati personali</TabsTrigger>
          </TabsList>
        </div>

        <ManagedVenuesTab
          tabValue='a'
          data={userData}
        />
        <PersonalDataTab
          tabValue='b'
          userData={userData}
        />
      </Tabs>
    </div>
  );
}
