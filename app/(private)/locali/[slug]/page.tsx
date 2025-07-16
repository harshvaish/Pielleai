import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getCountries } from '@/lib/data/get-countries';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BillingDataTab from '../../_components/Tabs/BillingDataTab';
import { getVenueManagers } from '@/lib/data/venue-managers/get-venue-managers';
import { getVenue } from '@/lib/data/venues/get-venue';
import VenueTypeBadge from '../../_components/VenueTypeBadge';
import UserBadge from '../../_components/UserBadge';
import SocialDataTab from '../../_components/Tabs/SocialDataTab';
import ToggleVenueBlockButton from './_components/ToggleVenueBlockButton';
import EditVenueButton from './_components/EditVenue/EditVenueButton';

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const { slug } = p;

  const [venue, countries, venueManagers] = await Promise.all([
    getVenue(slug),
    getCountries(),
    getVenueManagers(),
  ]).catch((error) => {
    console.error('❌ Error fetching:', error);
    notFound();
  });

  if (!venue) notFound();

  const isDisabled = venue.status === 'disabled';

  return (
    <>
      <div className='flex justify-between items-center'>
        <BackButton />
        <div className='flex items-center gap-4'>
          <ToggleVenueBlockButton
            venueId={venue.id}
            initialStatus={venue.status}
          />
          <EditVenueButton
            venueData={venue}
            countries={countries}
            venueManagers={venueManagers}
          />
        </div>
      </div>

      {/* main details section */}
      <section className='bg-white py-8 px-6 rounded-2xl'>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center gap-4'>
            <Image
              src={venue.avatarUrl}
              alt='Icona profilo locale'
              width={60}
              height={60}
              className={cn(
                'shrink-0 w-[60px] h-[60px] rounded-full object-cover',
                isDisabled ? 'grayscale' : ''
              )}
            />
            <div>
              <div className='flex items-center gap-4 mb-2'>
                <div className='text-2xl font-bold line-clamp-1 text-ellipsis break-all overflow-hidden'>
                  {venue.name}
                </div>
                <VenueTypeBadge type={venue.type} />
              </div>

              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Image
                    className='w-4 h-4'
                    src='/images/navbar-icons/manager-artists.svg'
                    alt='icona di una valigetta stilizzata'
                    width={16}
                    height={16}
                    loading='lazy'
                  />
                  <span className='text-sm text-zinc-600'>Manager</span>
                </div>
                <UserBadge
                  avatarUrl={venue.manager.avatarUrl}
                  href={`/promoter-locali/${venue.manager.id}`}
                  name={venue.manager.name}
                  surname={venue.manager.surname}
                  isDisabled={venue.manager.status === 'disabled'}
                  isSmall={true}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col items-end gap-0.5'>
            <div className='text-sm font-semibold text-zinc-500 whitespace-nowrap'>
              ID: {venue.id}
            </div>
            <div className='text-xs font-semibold text-zinc-400'>
              Data di creazione {format(venue.createdAt, 'dd/MM/yyyy, HH:mm')}
            </div>
            <div className='text-xs font-semibold text-zinc-400'>
              Data di aggiornamento{' '}
              {format(venue.updatedAt, 'dd/MM/yyyy, HH:mm')}
            </div>
          </div>
        </div>

        <Separator className='my-6' />

        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6'>
          <span className='text-sm font-semibold text-zinc-600'>Email</span>
          <span className='text-sm font-medium text-zinc-500'>
            {venue.billingEmail}
          </span>
          <span className='text-sm font-semibold text-zinc-600'>
            Numero di telefono
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {venue.billingPhone}
          </span>
          <span className='text-sm font-semibold text-zinc-600'>Capienza</span>
          <span className='text-sm font-medium text-zinc-500'>
            {venue.capacity}
          </span>
          <span className='text-sm font-semibold text-zinc-600'>Indirizzo</span>
          <span className='text-sm font-medium text-zinc-500'>
            {venue.address}
          </span>
        </div>
      </section>

      <Tabs defaultValue='billing-data'>
        <div className='flex justify-between items-center mb-6'>
          <span className='text-xl font-semibold'>Dettagli</span>
          <TabsList className='gap-4 bg-white p-1 rounded-xl'>
            <TabsTrigger value='billing-data'>Dati di fatturazione</TabsTrigger>
            <TabsTrigger value='social-data'>Social</TabsTrigger>
          </TabsList>
        </div>

        <BillingDataTab
          tabValue='billing-data'
          data={venue}
        />
        <SocialDataTab
          tabValue='social-data'
          data={venue}
        />
      </Tabs>
    </>
  );
}
