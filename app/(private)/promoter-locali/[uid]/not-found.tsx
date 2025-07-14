export default async function NotFoundPage() {
  return (
    <>
      <h1 className='text-2xl font-bold'>Promoter locali non trovato</h1>
      {/* artist managers table section */}
      <section className='min-h-80 flex flex-col justify-center items-center bg-white p-4 rounded-2xl'>
        <h2 className='text-base font-bold'>Nessun promoter locali</h2>
        <div className='text-sm font-medium text-zinc-400'>
          Aggiungine uno per vederlo nella lista
        </div>
      </section>
    </>
  );
}
