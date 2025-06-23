'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface InputPasswordProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  id?: string;
}

export default function InputPassword({
  value,
  onChange,
  error,
  id = 'password',
}: InputPasswordProps) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className='relative'>
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        placeholder='Password1234!'
        onChange={onChange}
        className={error ? 'border-destructive text-destructive' : ''}
        autoComplete='password'
        minLength={8}
        maxLength={16}
      />
      <div
        onClick={() => setVisible((prev) => !prev)}
        className='absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex justify-center items-center hover:cursor-pointer'
        aria-label={visible ? 'Nascondi password' : 'Mostra password'}
      >
        {visible ? (
          <EyeOff className='text-muted-foreground stroke-1' />
        ) : (
          <Eye className='text-muted-foreground stroke-1' />
        )}
      </div>
    </div>
  );
}
