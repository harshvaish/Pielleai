'use client';

import { Button } from '@/components/ui/button';
import { User } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type CheckButtonProps = {
  user: User;
};

export default function CheckButton({ user }: CheckButtonProps) {
  const router = useRouter();

  const onClickHandler = () => {
    if (user && user.status === 'active') {
      router.replace('/dashboard');
      return;
    }

    toast.info('Il tuo account è ancora in verifica.');
  };

  return (
    <Button
      size='sm'
      onClick={onClickHandler}
    >
      Continua
    </Button>
  );
}
