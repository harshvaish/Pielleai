import Image from 'next/image';

export default function Header() {
  return (
    <header className='max-h-max flex justify-between items-center px-8 py-4 border-b-1'>
      <Image
        className='w-44'
        src='/images/logo.svg'
        alt='logo con scritta Milano Ovest'
        width={174}
        height={40}
        priority
      />
    </header>
  );
}
