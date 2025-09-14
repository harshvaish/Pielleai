'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signOut } from '@/lib/server-actions/auth/sign-out';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const doSignout = async () => {
      const response = await signOut();

      if (!response.success) {
        toast.error(response.message || 'Disconnessione non riuscita, riprova più tardi.');
        return;
      }

      router.replace('/accedi');
    };

    void doSignout();
  }, []);

  return (
    <div className='w-full text-center bg-white p-8 rounded-2xl'>
      <h1 className='text-lg md:text-xl font-semibold mb-2'>Disconnessione in corso...</h1>
      <p className='text-sm text-zinc-500'>Stai per essere reindirizzato alla pagina di accesso.</p>
    </div>
  );
}
