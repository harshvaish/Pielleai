'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface InputPasswordProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function InputPassword({ error, ...props }: InputPasswordProps) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className='relative'>
      <Input
        type={visible ? 'text' : 'password'}
        className={error ? 'border-destructive text-destructive' : ''}
        autoComplete='password'
        minLength={8}
        maxLength={16}
        placeholder='********'
        {...props}
      />
      <div
        onClick={() => setVisible((prev) => !prev)}
        className='absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex justify-center items-center hover:cursor-pointer'
        aria-label={visible ? 'Nascondi password' : 'Mostra password'}
      >
        {visible ? (
          <EyeOff className='size-4 text-muted-foreground stroke-1' />
        ) : (
          <Eye className='size-4 text-muted-foreground stroke-1' />
        )}
      </div>
    </div>
  );
}
