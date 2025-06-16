import Image from 'next/image';
import ChangePasswordForm from './_components/ChangePasswordForm';
import { redirect } from 'next/navigation';
import InvalidTokenCard from './_components/InvalidTokenCard';

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string; error?: string }>;
}) {
  const params = await searchParams;
  const token = decodeURIComponent(params.token);
  const error = params.error ? decodeURIComponent(params.error) : null;

  if (error)
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
        <InvalidTokenCard />
      </main>
    );

  if (!token) redirect('/accedi');

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
      <ChangePasswordForm token={token} />
    </main>
  );
}
