'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import * as z from 'zod/v4';
import { toast } from 'sonner';
import { forgetPassword } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RPE_BLOCK_STORAGE_NAME } from '@/lib/constants';

export default function RecoverPasswordForm() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const validation = z
        .string()
        .min(1, 'Email obbligatoria')
        .email('Formato non valido')
        .safeParse(email);

      if (!validation.success) {
        setError(validation.error.issues[0].message);
        setIsLoading(false);
        return;
      } else {
        setError('');
      }

      await forgetPassword({
        email,
        redirectTo: '/cambia-password',
        fetchOptions: {
          onError: () => {
            toast.error('Invio email non riuscito, riprova più tardi');
            setIsLoading(false);
          },
          onSuccess: () => {
            localStorage.setItem(RPE_BLOCK_STORAGE_NAME, Date.now().toString());
            router.push(`recupera-password/conferma-invio?email=${email}`);
          },
        },
      });
    } catch (error) {
      console.error('Error: ', error instanceof Error ? error.message : error);
      toast.error('Invio email non riuscito, riprova più tardi');
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-xl items-center p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardHeader className='w-full max-w-sm gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold mb-2'>
          Recupera password
        </CardTitle>
        <CardDescription>
          Inserisci l&apos;indirizzo email associato al tuo account.
          <br />
          Ti invieremo un link per reimpostare la password.
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full max-w-sm p-0'>
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className='mb-8'>
            <label
              htmlFor='email'
              className='block text-sm font-semibold mb-2'
            >
              Email
            </label>
            <Input
              id='email'
              type='email'
              value={email}
              placeholder='esempio@milanoovest.it'
              onChange={(e) => setEmail(e.target.value)}
              className={error ? 'border-destructive text-destructive' : ''}
              autoFocus={true}
              autoComplete='email'
            />
            {error && <p className='text-xs text-destructive mt-2'>{error}</p>}
          </div>
          <Button
            className='w-full mb-12'
            type='submit'
            variant='default'
            disabled={isLoading}
          >
            {isLoading ? 'Invio email...' : 'Conferma'}
          </Button>
        </form>
        <Link
          href='/accedi'
          prefetch={false}
          className='flex justify-center items-center gap-0.5 text-sm text-muted-foreground'
        >
          <ArrowLeft
            size={16}
            className='text-muted-foreground'
          />
          Torna al login
        </Link>
      </CardContent>
    </Card>
  );
}
