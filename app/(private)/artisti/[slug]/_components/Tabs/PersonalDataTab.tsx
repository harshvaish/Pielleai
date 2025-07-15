import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { ArtistData } from '@/lib/types';
import ZonesBadge from '../../../_components/ZonesBadge';
import ArtistManagersBadge from '../../../_components/ArtistManagersBadge';

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
        <ArtistManagersBadge managers={userData.managers} />
        <Separator className='my-6' />
        {/* tourn manager */}
        <div className='text-xl font-semibold mb-6'>Tour manager</div>
        <div className='flex items-center gap-4 bg-zinc-50 p-2 rounded-sm'>
          <Avatar>
            <AvatarFallback className='font-semibold text-white bg-zinc-700'>
              {userData.tourManagerName.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className='text-zinc-700 font-semibold'>
              {userData.tourManagerName} {userData.tourManagerSurname}
            </div>
            <div className='text-xs text-zinc-600 font-medium'>
              {userData.tourManagerEmail}
            </div>
            <div className='text-xs text-zinc-600 font-medium'>
              {userData.tourManagerPhone}
            </div>
          </div>
        </div>
        <Separator className='my-6' />
        {/* zones */}
        <div className='text-xl font-semibold mb-6'>Aree di interesse</div>
        <ZonesBadge zones={userData.zones} />
      </div>
    </TabsContent>
  );
}
