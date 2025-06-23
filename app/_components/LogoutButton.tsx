'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();

  const onClickHandler = async () => {
    try {
      await authClient.signOut();
      router.replace('/accedi');
    } catch (error) {
      console.error(error);
      toast.error('Disconnessione non riuscita, riprova più tardi.');
    }
  };

  return <Button onClick={onClickHandler}>Logout</Button>;
}
