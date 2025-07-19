import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import NotesSection from '../../_components/Notes/NotesSection';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalDataTab from './_components/Tabs/PersonalDataTab';
import StatusBadge from '../../_components/Badges/StatusBadge';
import { getArtist } from '@/lib/data/artists/get-artist';
import { getArtistNotes } from '@/lib/data/notes/get-artist-notes';
import BillingDataTab from '../../_components/Tabs/BillingDataTab';
import SocialDataTab from '../../_components/Tabs/SocialDataTab';
import ToggleArtistBlockButton from './_components/ToggleArtistBlockButton';
import { getZones } from '@/lib/data/artists/get-zones';
import { getArtistManagers } from '@/lib/data/artist-managers/get-artist-managers';
import EditArtistButton from './_components/EditProfile/EditArtistButton';
import AvailabilitiesTab from './_components/Tabs/AvailabilitiesTab';

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const { slug } = p;

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

  const [userData, languages, countries, zones, artistManagers] =
    await Promise.all([
      getArtist(slug),
      getLanguages(),
      getCountries(),
      getZones(),
      getArtistManagers(),
    ]).catch((error) => {
      console.error('❌ Error fetching:', error);
      notFound();
    });

  if (!userData) notFound();

  const initialNotesData = await getArtistNotes({
    artistId: userData.id,
  });

  const isDisabled = userData.status === 'disabled';

  return (
    <>
      <div className='flex justify-between items-center'>
        <BackButton />
        <div className='flex items-center gap-4'>
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

      <div className='grid grid-cols-[60%_auto] gap-6'>
        {/* main details section */}
        <section className='bg-white py-8 px-6 rounded-2xl'>
          <div className='flex justify-between gap-2'>
            <div className='flex items-center gap-4'>
              <Image
                src={userData.avatarUrl}
                alt='Icona profilo artista'
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
                  <Badge variant={isDisabled ? 'disabled' : 'orange'}>
                    Artista
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
          isArtist={true}
          initialNotes={initialNotesData.data || []}
          writerId={session.user.id}
          receiverProfileId={userData.id}
        />
      </div>

      <Tabs defaultValue='personal-data'>
        <div className='flex justify-between items-center mb-6'>
          <span className='text-xl font-semibold'>Dettagli</span>
          <TabsList className='gap-4 bg-white p-1 rounded-xl'>
            <TabsTrigger value='personal-data'>Dati personali</TabsTrigger>
            <TabsTrigger value='billing-data'>Dati di fatturazione</TabsTrigger>
            <TabsTrigger value='availabilities'>Disponibilità</TabsTrigger>
            <TabsTrigger value='social-data'>Social</TabsTrigger>
          </TabsList>
        </div>

        <PersonalDataTab
          tabValue='personal-data'
          userData={userData}
        />
        <BillingDataTab
          tabValue='billing-data'
          data={userData}
        />
        <AvailabilitiesTab tabValue='availabilities' />
        <SocialDataTab
          tabValue='social-data'
          data={userData}
        />
      </Tabs>
    </>
  );
}
