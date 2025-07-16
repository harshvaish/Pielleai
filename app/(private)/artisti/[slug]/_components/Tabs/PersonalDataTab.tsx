import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { ArtistData } from '@/lib/types';
import ZonesBadge from '../../../../_components/Badges/ZonesBadge';
import TourManagerBadge from '@/app/(private)/_components/Badges/TourManagerBadge';
import ManagersBadge from '@/app/(private)/_components/Badges/ManagersBadge';

export default function PersonalDataTab({
  tabValue,
  userData,
}: {
  tabValue: string;
  userData: ArtistData;
}) {
  let languagesString = '';

  userData.languages.forEach((lang, index) => {
    languagesString += index === 0 ? lang.name : `, ${lang.name}`;
  });

  return (
    <TabsContent
      value={tabValue}
      className='grid grid-cols-[2fr_1fr] gap-6'
    >
      <div className='bg-white py-8 px-6 rounded-2xl'>
        <div className='text-xl font-semibold mb-6'>Dati personali</div>
        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6'>
          <span className='text-sm font-semibold text-zinc-600'>
            Luogo di nascita
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.birthDate}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>
            Data di nascita
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.birthPlace}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>
            Indirizzo di residenza
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.address}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>CAP</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.zipCode}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Comune</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.city}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Provincia</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.subdivision.name}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Stato</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.country.name}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Sesso</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.gender}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Lingue</span>
          <span className='text-sm font-medium text-zinc-500'>
            {languagesString}
          </span>
        </div>
      </div>
      <div className='bg-white py-8 px-6 rounded-2xl'>
        {/* managers */}
        <div className='text-xl font-semibold mb-6'>Manager</div>
        <ManagersBadge
          managers={userData.managers}
          pathSegment='manager-artisti'
        />
        <Separator className='my-6' />
        {/* tourn manager */}
        <div className='text-xl font-semibold mb-6'>Tour manager</div>
        <TourManagerBadge
          email={userData.tourManagerEmail}
          name={userData.tourManagerName}
          surname={userData.tourManagerSurname}
          phone={userData.tourManagerPhone}
        />
        <Separator className='my-6' />
        {/* zones */}
        <div className='text-xl font-semibold mb-6'>Aree di interesse</div>
        <ZonesBadge zones={userData.zones} />
      </div>
    </TabsContent>
  );
}
