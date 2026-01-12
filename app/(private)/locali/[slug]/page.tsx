import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { cn, hasRole, resolveNextPath } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToggleVenueBlockButton from './_components/ToggleVenueBlockButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import UpdateButton from './_components/update/UpdateButton';
import { getVenueCached } from '@/lib/cache/venues';
import { getCountriesCached } from '@/lib/cache/countries';
import { getVenueManagersCached } from '@/lib/cache/venue-managers';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import VenueTypeBadge from '../../_components/Badges/VenueTypeBadge';
import UserBadge from '../../_components/Badges/UserBadge';
import BillingDataTab from '../../_components/Tabs/BillingDataTab';
import SocialDataTab from '../../_components/Tabs/SocialDataTab';
import { ManagerBadgeFallback } from '../../_components/Badges/ManagersBadge';
import { AVATAR_FALLBACK, TIME_ZONE } from '@/lib/constants';

type VenueDetailPageProps = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  if (!hasRole(user, ['admin', 'venue-manager'])) {
    notFound();
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
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
  const createdAtZoned = format(toZonedTime(venue.createdAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const updatedAtZoned = format(toZonedTime(venue.updatedAt, TIME_ZONE), 'dd/MM/yyyy, HH:mm');

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
              userRole={user.role}
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
            userRole={user.role}
            venueData={venue}
            countries={countries}
            venueManagers={venueManagers}
          />
        </div>
      </div>

      {/* main details section */}
      <section className='bg-white py-8 px-6 rounded-2xl mb-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4'>
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <Image
                src={venue.avatarUrl || AVATAR_FALLBACK}
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
                  <div className='text-2xl font-bold'>{venue.name}</div>
                  <VenueTypeBadge
                    type={venue.type}
                    isDisabled={isDisabled}
                  />
                </div>

                <div className='hidden lg:flex items-center gap-4'>
                  <div className='flex items-center gap-1'>
                    <Image
                      className='w-4 h-4'
                      src='/images/navbar-icons/artist-managers.svg'
                      alt='icona di una valigetta stilizzata'
                      width={16}
                      height={16}
                      loading='lazy'
                    />
                    <span className='text-sm text-zinc-600'>Promoter locale</span>
                  </div>
                  {venue.manager ? (
                    <UserBadge
                      avatarUrl={venue.manager.avatarUrl || AVATAR_FALLBACK}
                      href={`/promoter-locali/${venue.manager.id}`}
                      name={venue.manager.name}
                      surname={venue.manager.surname}
                      isDisabled={venue.manager.status === 'disabled'}
                      isSmall={true}
                    />
                  ) : (
                    <ManagerBadgeFallback />
                  )}
                </div>
              </div>
            </div>

            <div className='flex lg:hidden items-center gap-4'>
              <div className='flex items-center gap-1'>
                <Image
                  className='w-4 h-4'
                  src='/images/navbar-icons/artist-managers.svg'
                  alt='icona di una valigetta stilizzata'
                  width={16}
                  height={16}
                  loading='lazy'
                />
                <span className='text-sm text-zinc-600'>Promoter locale</span>
              </div>
              {venue.manager ? (
                <UserBadge
                  avatarUrl={venue.manager.avatarUrl || AVATAR_FALLBACK}
                  href={`/promoter-locali/${venue.manager.id}`}
                  name={venue.manager.name}
                  surname={venue.manager.surname}
                  isDisabled={venue.manager.status === 'disabled'}
                  isSmall={true}
                />
              ) : (
                <ManagerBadgeFallback />
              )}
            </div>
            <div className='text-xs font-medium text-zinc-500'>{venue.bio}</div>
          </div>

          <div className='flex flex-col lg:items-end gap-0.5'>
            <div className='text-sm font-semibold text-zinc-500 whitespace-nowrap'>
              ID: {venue.id}
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

        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6 overflow-x-auto'>
          <span className='text-sm font-semibold text-zinc-600'>Email</span>
          <span className='text-sm font-medium text-zinc-500'>{venue.billingEmail}</span>
          <span className='text-sm font-semibold text-zinc-600'>Numero di telefono</span>
          <span className='text-sm font-medium text-zinc-500'>{venue.billingPhone}</span>
          <span className='text-sm font-semibold text-zinc-600'>Capienza</span>
          <span className='text-sm font-medium text-zinc-500'>{venue.capacity !== 0 && (
               <span>{venue.capacity}</span>
              )}
          </span>
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
