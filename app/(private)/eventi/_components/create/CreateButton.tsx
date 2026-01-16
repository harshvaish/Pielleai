'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { Plus } from 'lucide-react';

type CreateButtonProps = {
  buttonLabel?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonSize?: VariantProps<typeof buttonVariants>['size'];
};

export default function CreateButton({
  buttonLabel = 'Aggiungi',
  buttonVariant,
  buttonSize = 'sm',
}: CreateButtonProps) {
  return (
    <Button
      asChild
      size={buttonSize}
      variant={buttonVariant}
    >
      <Link href='/eventi/crea'>
        <Plus />
        {buttonLabel}
      </Link>
    </Button>
  );
}
