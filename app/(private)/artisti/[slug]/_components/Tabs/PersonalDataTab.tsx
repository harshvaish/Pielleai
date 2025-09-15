import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { ArtistData, UserRole } from '@/lib/types';
import ZonesBadge from '../../../../_components/badges/ZonesBadge';
import TourManagerBadge from '@/app/(private)/_components/badges/TourManagerBadge';
import ManagersBadge from '@/app/(private)/_components/badges/ManagersBadge';
import { GENDERS_LABELS } from '@/lib/constants';

type PersonalDataTabProps = { tabValue: string; data: ArtistData; userRole: UserRole };

export default function PersonalDataTab({ tabValue, data, userRole }: PersonalDataTabProps) {
  let languagesString = '';

  data.languages.forEach((lang, index) => {
    languagesString += index === 0 ? lang.name : `, ${lang.name}`;
  });

  return (
    <TabsContent
      value={tabValue}
      className='grid xl:grid-cols-[2fr_1fr] gap-6'
    >
      <div className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
        <div className='text-xl font-semibold mb-6'>Dati personali</div>
        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6 overflow-x-auto'>
          <span className='text-sm font-semibold text-zinc-600'>Luogo di nascita</span>
          <span className='text-sm font-medium text-zinc-500'>{data.birthDate}</span>

          <span className='text-sm font-semibold text-zinc-600'>Data di nascita</span>
          <span className='text-sm font-medium text-zinc-500'>{data.birthPlace}</span>

          <span className='text-sm font-semibold text-zinc-600'>Indirizzo di residenza</span>
          <span className='text-sm font-medium text-zinc-500'>{data.address}</span>

          <span className='text-sm font-semibold text-zinc-600'>CAP</span>
          <span className='text-sm font-medium text-zinc-500'>{data.zipCode}</span>

          <span className='text-sm font-semibold text-zinc-600'>Comune</span>
          <span className='text-sm font-medium text-zinc-500'>{data.city}</span>

          <span className='text-sm font-semibold text-zinc-600'>Provincia</span>
          <span className='text-sm font-medium text-zinc-500'>{data.subdivision.name}</span>

          <span className='text-sm font-semibold text-zinc-600'>Stato</span>
          <span className='text-sm font-medium text-zinc-500'>{data.country.name}</span>

          <span className='text-sm font-semibold text-zinc-600'>Sesso</span>
          <span className='text-sm font-medium text-zinc-500'>{GENDERS_LABELS[data.gender]}</span>

          <span className='text-sm font-semibold text-zinc-600'>Lingue</span>
          <span className='text-sm font-medium text-zinc-500'>{languagesString}</span>
        </div>
      </div>
      <div className='bg-white py-8 px-6 rounded-2xl'>
        {/* managers */}
        <div className='text-xl font-semibold mb-6'>Manager</div>
        <ManagersBadge
          userRole={userRole}
          managers={data.managers}
          pathSegment='manager-artisti'
        />
        <Separator className='my-6' />
        {/* tourn manager */}
        <div className='text-xl font-semibold mb-6'>Tour manager</div>
        <TourManagerBadge
          email={data.tourManagerEmail}
          name={data.tourManagerName}
          surname={data.tourManagerSurname}
          phone={data.tourManagerPhone}
        />
        <Separator className='my-6' />
        {/* zones */}
        <div className='text-xl font-semibold mb-6'>Aree di interesse</div>
        <ZonesBadge zones={data.zones} />
      </div>
    </TabsContent>
  );
}
