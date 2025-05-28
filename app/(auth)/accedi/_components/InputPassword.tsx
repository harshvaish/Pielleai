'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <Button
        type='button'
        variant='secondary'
        onClick={() => setVisible((prev) => !prev)}
        className='absolute right-0 top-1/2 -translate-y-1/2 h-full bg-transparent hover:bg-transparent shadow-none'
        aria-label={visible ? 'Nascondi password' : 'Mostra password'}
      >
        {visible ? (
          <EyeOff className='text-muted-foreground' />
        ) : (
          <Eye className='text-muted-foreground' />
        )}
      </Button>
    </div>
  );
}
