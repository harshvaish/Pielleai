'use client';

export default function ErrorPage() {
  return (
    <div className='w-full text-center bg-white p-8 rounded-2xl'>
      <h1 className='text-lg md:text-xl font-semibold mb-2'>Ops! Qualcosa è andato storto.</h1>
      <p className='text-sm text-zinc-500'>
        Stiamo lavorando per risolvere il problema. <br /> Ti invitiamo a riprovare più tardi.
      </p>
    </div>
  );
}
