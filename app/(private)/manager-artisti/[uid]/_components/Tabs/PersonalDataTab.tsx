import { TabsContent } from '@/components/ui/tabs';
import { ArtistsManagerData } from '@/lib/types';

export default function PersonalDataTab({
  tabValue,
  userData,
}: {
  tabValue: string;
  userData: ArtistsManagerData;
}) {
  let languagesString = '';

  userData.languages.forEach((lang, index) => {
    languagesString += index === 0 ? lang.name : `, ${lang.name}`;
  });

  return (
    <TabsContent
      value={tabValue}
      className='bg-white py-8 px-6 rounded-2xl'
    >
      <div className='text-xl font-semibold mb-6'>Informazioni personali</div>
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
    </TabsContent>
  );
}
