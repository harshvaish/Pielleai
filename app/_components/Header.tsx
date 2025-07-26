import Image from 'next/image';
import NavbarButton from './NavbarButton';

export default async function Header() {
  return (
    <header className='max-h-max flex justify-between items-center px-4 md:px-8 py-4 border-b-1'>
      <Image
        className='md:hidden w-10 h-10'
        src='/images/icon-black.svg'
        alt='logo Milano Ovest'
        width={40}
        height={40}
        priority
      />

      <Image
        className='hidden md:block w-44'
        src='/images/logo.svg'
        alt='logo con scritta Milano Ovest'
        width={174}
        height={40}
        priority
      />

      <NavbarButton />
    </header>
  );
}
