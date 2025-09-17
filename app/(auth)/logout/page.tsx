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
    <div className='w-full max-w-2xl text-center bg-white p-8 rounded-2xl'>
      <h1 className='text-lg md:text-xl font-semibold mb-2'>Sessione scaduta o non più valida.</h1>
      <p className='text-sm text-zinc-500'>Disconnessione in corso...</p>
    </div>
  );
}
