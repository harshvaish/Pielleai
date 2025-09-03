import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { cn, resolveNextPath } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BillingDataTab from '../../_components/tabs/BillingDataTab';
import VenueTypeBadge from '../../_components/badges/VenueTypeBadge';
import UserBadge from '../../_components/badges/UserBadge';
import SocialDataTab from '../../_components/tabs/SocialDataTab';
import ToggleVenueBlockButton from './_components/ToggleVenueBlockButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import UpdateButton from './_components/update/UpdateButton';
import { getVenueCached } from '@/lib/cache/venues';
import { getCountriesCached } from '@/lib/cache/countries';
import { getVenueManagersCached } from '@/lib/cache/venue-managers';
import { userHasProfile } from '@/lib/data/profiles/userHasProfile';
import getSession from '@/lib/data/auth/get-session';

type VenueDetailPageProps = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { session, user } = await getSession();
  if (!session || !user) redirect('/accedi');
  const hasProfile = await userHasProfile(user.id);
  const target = resolveNextPath({ user, hasProfile });
  if (target) redirect(target);

  const p = await params;
  const { slug } = p;

  const [venue, countries, venueManagers] = await Promise.all([
    getVenueCached(slug),
    getCountriesCached(),
    getVenueManagersCached(),
  ]);

  if (!venue) notFound();

  const isDisabled = venue.status === 'disabled';

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
              venueData={venue}
              countries={countries}
              venueManagers={venueManagers}
            />
            <ToggleVenueBlockButton
              venueId={venue.id}
              initialStatus={venue.status}
            />
          </PopoverContent>
        </Popover>

        <div className='hidden lg:flex items-center gap-4'>
          <ToggleVenueBlockButton
            venueId={venue.id}
            initialStatus={venue.status}
          />
          <UpdateButton
            venueData={venue}
            countries={countries}
            venueManagers={venueManagers}
          />
        </div>
      </div>

      {/* main details section */}
      <section className='bg-white py-8 px-6 rounded-2xl mb-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-4'>
              <Image
                src={venue.avatarUrl}
                alt='Icona profilo locale'
                width={60}
                height={60}
                className={cn(
                  'shrink-0 w-[60px] h-[60px] rounded-full object-cover',
                  isDisabled ? 'grayscale' : '',
                )}
              />
              <div>
                <div className='lg:flex items-center gap-2 lg:gap-4 space-y-2 mb-2'>
                  <div className='text-2xl font-bold line-clamp-1 text-ellipsis break-all overflow-hidden'>
                    {venue.name}
                  </div>
                  <VenueTypeBadge
                    type={venue.type}
                    isDisabled={isDisabled}
                  />
                </div>

                <div className='hidden lg:flex items-center gap-4'>
                  <div className='flex items-center gap-1'>
                    <Image
                      className='w-4 h-4'
                      src='/images/navbar-icons/manager-artists.svg'
                      alt='icona di una valigetta stilizzata'
                      width={16}
                      height={16}
                      loading='lazy'
                    />
                    <span className='text-sm text-zinc-600'>Promoter locale</span>
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
            <div className='flex lg:hidden items-center gap-4'>
              <div className='flex items-center gap-1'>
                <Image
                  className='w-4 h-4'
                  src='/images/navbar-icons/manager-artists.svg'
                  alt='icona di una valigetta stilizzata'
                  width={16}
                  height={16}
                  loading='lazy'
                />
                <span className='text-sm text-zinc-600'>Promoter locale</span>
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

          <div className='flex flex-col lg:items-end gap-0.5'>
            <div className='text-sm font-semibold text-zinc-500 whitespace-nowrap'>
              ID: {venue.id}
            </div>
            <div className='text-xs font-semibold text-zinc-400'>
              Data di creazione {format(venue.createdAt, 'dd/MM/yyyy, HH:mm')}
            </div>
            <div className='text-xs font-semibold text-zinc-400'>
              Data di aggiornamento {format(venue.updatedAt, 'dd/MM/yyyy, HH:mm')}
            </div>
          </div>
        </div>

        <Separator className='my-6' />

        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6 overflow-x-auto'>
          <span className='text-sm font-semibold text-zinc-600'>Email</span>
          <span className='text-sm font-medium text-zinc-500'>{venue.billingEmail}</span>
          <span className='text-sm font-semibold text-zinc-600'>Numero di telefono</span>
          <span className='text-sm font-medium text-zinc-500'>{venue.billingPhone}</span>
          <span className='text-sm font-semibold text-zinc-600'>Capienza</span>
          <span className='text-sm font-medium text-zinc-500'>{venue.capacity}</span>
          <span className='text-sm font-semibold text-zinc-600'>Indirizzo</span>
          <span className='text-sm font-medium text-zinc-500'>{venue.address}</span>
        </div>
      </section>

      <Tabs defaultValue='a'>
        <div className='flex justify-between items-center mb-2 overflow-hidden'>
          <span className='hidden lg:block text-xl font-semibold'>Dettagli</span>
          <TabsList className='w-full lg:max-w-max justify-start gap-4 bg-white p-1 rounded-xl overflow-x-auto'>
            <TabsTrigger value='a'>Dati di fatturazione</TabsTrigger>
            <TabsTrigger value='b'>Social</TabsTrigger>
          </TabsList>
        </div>

        <BillingDataTab
          tabValue='a'
          data={venue}
        />
        <SocialDataTab
          tabValue='b'
          data={venue}
        />
      </Tabs>
    </div>
  );
}
