import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { ArtistData } from '@/lib/types';
import { GENDERS_LABELS } from '@/lib/constants';
import ZonesBadge from '@/app/(private)/_components/Badges/ZonesBadge';

type PersonalDataTabProps = {
  tabValue: string;
  data: ArtistData;
};

const CAPACITY_LABELS: Record<NonNullable<ArtistData['capacityCategory']>, string> = {
  small: 'Piccola',
  medium: 'Media',
  big: 'Grande',
};

export default function PersonalDataTab({
  tabValue,
  data,
}: PersonalDataTabProps) {
  let languagesString = '';

  data.languages.forEach((lang, index) => {
    languagesString += index === 0 ? lang.name : `, ${lang.name}`;
  });

  const hasBirthPlace = Boolean(data.birthPlace?.trim());
  const hasPlaceholderBirthDate = data.birthDate === '1970-01-01';
  const birthPlaceValue = hasBirthPlace ? data.birthPlace : '-';
  const birthDateValue = !data.birthDate || hasPlaceholderBirthDate ? '-' : data.birthDate;
  const genderValue =
    data.gender && !(data.gender === 'non-binary' && !hasBirthPlace && hasPlaceholderBirthDate)
      ? GENDERS_LABELS[data.gender]
      : '-';

  return (
    <TabsContent
      value={tabValue}
    >
      <div className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
        <div className='text-xl font-semibold mb-6'>Dati personali</div>
        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6 overflow-x-auto'>
          <span className='text-sm font-semibold text-zinc-600'>Luogo di nascita</span>
          <span className='text-sm font-medium text-zinc-500'>{birthPlaceValue}</span>

          <span className='text-sm font-semibold text-zinc-600'>Data di nascita</span>
          <span className='text-sm font-medium text-zinc-500'>{birthDateValue}</span>

          <span className='text-sm font-semibold text-zinc-600'>Indirizzo di residenza</span>
          <span className='text-sm font-medium text-zinc-500'>{data.address || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>CAP</span>
          <span className='text-sm font-medium text-zinc-500'>{data.zipCode || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Comune</span>
          <span className='text-sm font-medium text-zinc-500'>{data.city || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Provincia</span>
          <span className='text-sm font-medium text-zinc-500'>{data.subdivision?.name || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Stato</span>
          <span className='text-sm font-medium text-zinc-500'>{data.country?.name || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Sesso</span>
          <span className='text-sm font-medium text-zinc-500'>{genderValue}</span>

          <span className='text-sm font-semibold text-zinc-600'>Lingue</span>
          <span className='text-sm font-medium text-zinc-500'>{languagesString}</span>

          <span className='text-sm font-semibold text-zinc-600'>Categorie</span>
          <div className='flex flex-wrap items-center gap-2'>
            {data.categories?.length ? (
              data.categories.map((category) => (
                <Badge
                  key={category}
                  variant='secondary'
                >
                  {category}
                </Badge>
              ))
            ) : (
              <span className='text-sm font-medium text-zinc-500'>-</span>
            )}
          </div>

          <span className='text-sm font-semibold text-zinc-600'>Categoria capienza</span>
          <span className='text-sm font-medium text-zinc-500'>
            {data.capacityCategory ? CAPACITY_LABELS[data.capacityCategory] : '-'}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Aree di interesse</span>
          <ZonesBadge zones={data.zones} />
        </div>
      </div>
    </TabsContent>
  );
}
