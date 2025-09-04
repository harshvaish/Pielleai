'use client';

export default function ErrorPage() {
  return (
    <div className='w-full text-center bg-white p-8 rounded-2xl'>
      <h1 className='text-lg md:text-xl font-semibold mb-2'>404 | Pagina non trovata</h1>
      <p className='text-sm text-zinc-500'>Per favore controlla la url ricercata e riprova.</p>
    </div>
  );
}
