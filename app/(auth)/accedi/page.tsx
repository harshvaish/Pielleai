import Image from 'next/image';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
  return (
    <main className='flex flex-col items-center w-full h-dvh bg-black px-4'>
      <Image
        className='w-20 md:w-26 xl:w-36 mt-12 mb-18'
        src='/images/icon.svg'
        alt='logo Milano Ovest'
        width={140}
        height={144}
        priority
      />
      <LoginForm />
    </main>
  );
}
