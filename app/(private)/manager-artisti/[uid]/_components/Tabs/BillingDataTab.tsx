import { TabsContent } from '@/components/ui/tabs';
import { ArtistsManagerData } from '@/lib/types';

export default function BillingDataTab({
  userData,
}: {
  userData: ArtistsManagerData;
}) {
  return (
    <TabsContent
      value='billing-data'
      className='grid grid-cols-2 gap-6'
    >
      <section className='bg-white py-8 px-6 rounded-2xl'>
        <div className='text-xl font-semibold mb-6'>Dati di fatturazione</div>
        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6'>
          <span className='text-sm font-semibold text-zinc-600'>
            Ragione sociale
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.company}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>
            Codice fiscale
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.taxCode}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>IBAN</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.iban}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>
            Codice IPI
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.ipiCode}
          </span>

          {userData.sdiRecipientCode && (
            <>
              <span className='text-sm font-semibold text-zinc-600'>
                Codice destinatario SDI
              </span>
              <span className='text-sm font-medium text-zinc-500'>
                {userData.sdiRecipientCode}
              </span>
            </>
          )}

          {userData.abaRoutingNumber && (
            <>
              <span className='text-sm font-semibold text-zinc-600'>
                Codice
              </span>
              <span className='text-sm font-medium text-zinc-500'>
                {userData.abaRoutingNumber}
              </span>
            </>
          )}

          {userData.bicCode && (
            <>
              <span className='text-sm font-semibold text-zinc-600'>
                Codice BIC
              </span>
              <span className='text-sm font-medium text-zinc-500'>
                {userData.bicCode}
              </span>
            </>
          )}
        </div>
      </section>

      <section className='bg-white py-8 px-6 rounded-2xl'>
        <div className='text-xl font-semibold mb-6'>
          Indirizzo di fatturazione
        </div>
        <div className='grid grid-cols-[minmax(200px,max-content)_max-content] gap-6'>
          <span className='text-sm font-semibold text-zinc-600'>
            Indirizzo di fatturazione
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.billingAddress}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>CAP</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.billingZipCode}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Comune</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.billingCity}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Provincia</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.billingSubdivision.name}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>Stato</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.billingCountry.name}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>
            Email di fatturazione
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.billingEmail}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>PEC</span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.billingPec}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>
            Numero di telefono
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.billingPhone}
          </span>

          <span className='text-sm font-semibold text-zinc-600'>
            Imponibile in fattura
          </span>
          <span className='text-sm font-medium text-zinc-500'>
            {userData.taxableInvoice ? 'Sì' : 'No'}
          </span>
        </div>
      </section>
    </TabsContent>
  );
}
