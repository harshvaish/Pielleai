export default async function NotFoundPage() {
  return (
    <>
      <h1 className='text-xl md:text-2xl font-bold'>Promoter locali</h1>

      <section className='min-h-80 flex flex-col justify-center items-center bg-white p-4 rounded-2xl'>
        <h2 className='text-base font-bold'>Promoter locali non trovato</h2>
        <div className='text-sm font-medium text-zinc-400'>Controlla i dati ricercati e riprova</div>
      </section>
    </>
  );
}
