import { TabsContent } from '@/components/ui/tabs';
import { ArtistData, ArtistManagerData, VenueData } from '@/lib/types';

export default function BillingDataTab({
  tabValue,
  data,
}: {
  tabValue: string;
  data: ArtistManagerData | ArtistData | VenueData;
}) {
  return (
    <TabsContent
      value={tabValue}
      className='grid xl:grid-cols-2 gap-6'
    >
      <section className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
        <div className='text-xl font-semibold mb-6'>Dati di fatturazione</div>
        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6 overflow-x-auto'>
          <span className='text-sm font-semibold text-zinc-600'>Ragione sociale</span>
          <span className='text-sm font-medium text-zinc-500'>{data.company || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Codice fiscale</span>
          <span className='text-sm font-medium text-zinc-500'>{data.taxCode || '-'}</span>

          {'vatCode' in data && data.vatCode && (
            <>
              <span className='text-sm font-semibold text-zinc-600'>Partita IVA</span>
              <span className='text-sm font-medium text-zinc-500'>{data.vatCode}</span>
            </>
          )}

          <span className='text-sm font-semibold text-zinc-600'>Codice destinatario SDI</span>
          <span className='text-sm font-medium text-zinc-500'>{data.sdiRecipientCode || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Codice</span>
          <span className='text-sm font-medium text-zinc-500'>{data.abaRoutingNumber || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Codice BIC</span>
          <span className='text-sm font-medium text-zinc-500'>{data.bicCode || '-'}</span>
        </div>
      </section>

      <section className='bg-white py-8 px-6 rounded-2xl overflow-x-hidden'>
        <div className='text-xl font-semibold mb-6'>Sede legale</div>
        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6 overflow-x-auto'>
          <span className='text-sm font-semibold text-zinc-600'>Sede legale</span>
          <span className='text-sm font-medium text-zinc-500'>{data.billingAddress || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>CAP</span>
          <span className='text-sm font-medium text-zinc-500'>{data.billingZipCode || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Comune</span>
          <span className='text-sm font-medium text-zinc-500'>{data.billingCity || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Provincia</span>
          <span className='text-sm font-medium text-zinc-500'>
            {data.billingSubdivision?.name || '-'}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Stato</span>
          <span className='text-sm font-medium text-zinc-500'>
            {data.billingCountry?.name || '-'}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Email di fatturazione</span>
          <span className='text-sm font-medium text-zinc-500'>{data.billingEmail || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>PEC</span>
          <span className='text-sm font-medium text-zinc-500'>{data.billingPec || '-'}</span>

          <span className='text-sm font-semibold text-zinc-600'>Numero di telefono</span>
          <span className='text-sm font-medium text-zinc-500'>{data.billingPhone || '-'}</span>
        </div>
      </section>
    </TabsContent>
  );
}
