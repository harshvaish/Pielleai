'use client';

import { signOut } from '@/lib/auth-client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(); // clears cookies/session on the client
      } finally {
        // always go back to login page
        router.replace('/accedi');
      }
    };
    void doLogout();
  }, [router]);

  return (
    <div className='w-full text-center bg-white p-8 rounded-2xl'>
      <h1 className='text-lg md:text-xl font-semibold mb-2'>Disconnessione in corso...</h1>
      <p className='text-sm text-zinc-500'>Stai per essere reindirizzato alla pagina di accesso.</p>
    </div>
  );
}
