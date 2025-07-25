import Image from 'next/image';
import ResetPasswordForm from './_components/ResetPasswordForm';
import { redirect } from 'next/navigation';
import InvalidTokenCard from './_components/InvalidTokenCard';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string; error?: string }>;
}) {
  const params = await searchParams;
  const token = decodeURIComponent(params.token);
  const error = params.error ? decodeURIComponent(params.error) : null;

  if (error)
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
        <InvalidTokenCard />
      </main>
    );

  if (!token) redirect('/accedi');

  return (
    <main className='flex flex-col items-center w-full h-dvh bg-black px-4'>
      <Image
        className='w-20 md:w-26 xl:w-36 mt-8 mb-12'
        src='/images/icon.svg'
        alt='logo Milano Ovest'
        width={140}
        height={144}
        priority
      />
      <ResetPasswordForm token={token} />
    </main>
  );
}
