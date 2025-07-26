import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='flex flex-col items-center w-full h-dvh bg-black p-4 overflow-y-auto'>
      <Image
        className='w-20 md:w-24 xl:w-28 mt-8 mb-12'
        src='/images/icon.svg'
        alt='logo Milano Ovest'
        width={140}
        height={144}
        priority
      />
      {children}
    </main>
  );
}
