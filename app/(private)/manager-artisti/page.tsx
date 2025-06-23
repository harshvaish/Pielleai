import CreateArtistManagerButton from './_components/CreateArtistManagerButton';

export default function ArtistManagersPage() {
  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Manager Artisti</h1>
        <CreateArtistManagerButton />
      </div>
      {/* artist managers table section */}
      <section className='min-h-80 flex flex-col justify-center items-center bg-white p-4 rounded-2xl'>
        <h2 className='text-base font-bold'>Nessun manager artista</h2>
        <div className='text-sm font-medium text-zinc-400'>
          Aggiungine uno per vederlo nella lista
        </div>
      </section>
    </>
  );
}
