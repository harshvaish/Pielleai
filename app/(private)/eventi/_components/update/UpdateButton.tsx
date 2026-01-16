'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Event } from '@/lib/types';

type UpdateButtonProps = {
  event: Event;
};

export default function UpdateButton({ event }: UpdateButtonProps) {
  return (
    <Button
      asChild
      variant='secondary'
      size='sm'
    >
      <Link href={`/eventi/${event.id}/modifica`}>
        <Pencil /> Modifica
      </Link>
    </Button>
  );
}
