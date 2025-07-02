'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const onClickHandler = async () => {
    router.back();
  };

  return (
    <Button
      variant='ghost'
      onClick={onClickHandler}
      className='flex items-center gap-2 text-sm text-zinc-600 font-medium transition-all hover:gap-1'
    >
      <ArrowLeft /> Indietro
    </Button>
  );
}
