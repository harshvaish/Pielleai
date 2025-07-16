import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { getArtistManager } from '@/lib/data/artist-managers/get-artist-manager';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getProfileNotes } from '@/lib/data/notes/get-profile-notes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import EditArtistManagerButton from './_components/EditProfile/EditArtistManagerButton';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalDataTab from './_components/Tabs/PersonalDataTab';
import BillingDataTab from '../../_components/Tabs/BillingDataTab';
import StatusBadge from '../../_components/StatusBadge';
import NotesSection from '../../_components/Notes/NotesSection';
import ToggleBlockButton from '../../_components/ToggleBlockButton';
import ManagedArtistsTab from './_components/Tabs/ManagedArtistsTab';

export default async function ArtistManagerDetailPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const p = await params;
  const { uid } = p;

  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || !session.user || !session.user.id) {
    await auth.api
      .signOut({
        headers: requestHeaders,
      })
      .catch((error) => console.error(error));

    redirect('/accedi');
  }

  const [userData, languages, countries] = await Promise.all([
    getArtistManager(uid),
    getLanguages(),
    getCountries(),
  ]).catch((error) => {
    console.error('❌ Error fetching:', error);
    notFound();
  });

  if (!userData) notFound();

  const initialNotesData = await getProfileNotes({
    receiverProfileId: userData.profileId,
  });

  const isDisabled = userData.status === 'disabled';

  return (
    <>
      <div className='flex justify-between items-center'>
        <BackButton />
        <div className='flex items-center gap-4'>
          <ToggleBlockButton
            userId={userData.id}
            userInitialStatus={userData.status}
          />
          <EditArtistManagerButton
            userData={userData}
            languages={languages}
            countries={countries}
          />
        </div>
      </div>

      <div className='grid grid-cols-[60%_auto] gap-6'>
        {/* main details section */}
        <section className='bg-white py-8 px-6 rounded-2xl'>
          <div className='flex justify-between gap-2'>
            <div className='flex items-center gap-4'>
              <Image
                src={userData.avatarUrl}
                alt='Icona profilo manager artista'
                width={60}
                height={60}
                className={cn(
                  'shrink-0 w-[60px] h-[60px] rounded-full object-cover',
                  isDisabled ? 'grayscale' : ''
                )}
              />

              <div className='flex flex-col gap-1.5'>
                <div className='text-2xl font-bold line-clamp-1 text-ellipsis break-all overflow-hidden'>
                  {userData.name} {userData.surname}
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant={isDisabled ? 'disabled' : 'success'}>
                    Manager artista
                  </Badge>
                  {isDisabled && <StatusBadge status='disabled' />}
                </div>
              </div>
            </div>

            <div className='flex flex-col items-end gap-0.5'>
              <div className='text-sm font-semibold text-zinc-500 whitespace-nowrap'>
                ID: {userData.id}
              </div>
              <div className='text-xs font-semibold text-zinc-400'>
                Data di creazione{' '}
                {format(userData.createdAt, 'dd/MM/yyyy, HH:mm')}
              </div>
              <div className='text-xs font-semibold text-zinc-400'>
                Data di aggiornamento{' '}
                {format(userData.updatedAt, 'dd/MM/yyyy, HH:mm')}
              </div>
            </div>
          </div>
          <Separator className='my-6' />
          <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6'>
            <span className='text-sm font-semibold text-zinc-600'>Email</span>
            <span className='text-sm font-medium text-zinc-500'>
              {userData.email}
            </span>
            <span className='text-sm font-semibold text-zinc-600'>
              Numero di telefono
            </span>
            <span className='text-sm font-medium text-zinc-500'>
              {userData.phone}
            </span>
            <span className='text-sm font-semibold text-zinc-600'>
              Indirizzo PEC
            </span>
            <span className='text-sm font-medium text-zinc-500'>
              {userData.billingPec}
            </span>
            <span className='text-sm font-semibold text-zinc-600'>
              Ragione sociale
            </span>
            <span className='text-sm font-medium text-zinc-500'>
              {userData.company}
            </span>
          </div>
        </section>

        <NotesSection
          isArtist={false}
          initialNotes={initialNotesData.data || []}
          writerId={session.user.id}
          receiverProfileId={userData.profileId}
        />
      </div>

      <Tabs defaultValue='managed-artists'>
        <div className='flex justify-between items-center mb-6'>
          <span className='text-xl font-semibold'>Dettagli</span>
          <TabsList className='gap-4 bg-white p-1 rounded-xl'>
            <TabsTrigger value='managed-artists'>Artisti gestiti</TabsTrigger>
            <TabsTrigger value='billing-data'>Dati di fatturazione</TabsTrigger>
            <TabsTrigger value='personal-data'>Dati personali</TabsTrigger>
          </TabsList>
        </div>

        <ManagedArtistsTab
          tabValue='managed-artists'
          data={userData}
        />
        <BillingDataTab
          tabValue='billing-data'
          data={userData}
        />
        <PersonalDataTab
          tabValue='personal-data'
          userData={userData}
        />
      </Tabs>
    </>
  );
}
