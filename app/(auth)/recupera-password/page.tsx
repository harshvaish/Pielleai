import Image from 'next/image';
import RecoverPasswordForm from './_components/RecoverPasswordForm';

export default function RecoverPasswordPage() {
  return (
    <main className='flex flex-col items-center w-full h-dvh bg-black bg-[url(/images/background.webp)] bg-right xl:bg-center bg-cover'>
      <Image
        className='w-20 md:w-26 xl:w-36 mt-12 mb-18'
        src='/images/icon.svg'
        alt='logo Milano Ovest'
        width={140}
        height={144}
        priority
      />
      <RecoverPasswordForm />
    </main>
  );
}
