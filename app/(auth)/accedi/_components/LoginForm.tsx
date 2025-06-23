'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputPassword from './InputPassword';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/lib/validation/signInSchema';
import { signInAction } from '@/lib/server-actions/sign-in.action';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const validation = signInSchema.safeParse({ email, password });

    if (!validation.success) {
      const validationErrors = { email: '', password: '' };
      validation.error.errors.forEach((e) => {
        if (e.path.includes('email')) validationErrors.email = e.message;
        if (e.path.includes('password')) validationErrors.password = e.message;
      });
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    } else {
      setErrors({});
    }

    try {
      const response = await signInAction(email, password);

      if (response.success) {
        router.push('/dashboard');
      } else {
        toast.error(response.message || 'Oops, qualcosa è andato storto');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error: ', error instanceof Error ? error.message : error);
      toast.error('Autenticazione non riuscita, riprova più tardi');
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-xl items-center p-6 xl:p-12 rounded-2xl'>
      <CardHeader className='w-full gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold'>Autenticazione</CardTitle>
      </CardHeader>
      <CardContent className='w-full max-w-sm p-0'>
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className='mb-4'>
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
              className={
                errors.email ? 'border-destructive text-destructive' : ''
              }
              autoFocus={true}
              autoComplete='email'
            />
            {errors.email && (
              <p className='text-xs text-destructive mt-2'>{errors.email}</p>
            )}
          </div>
          <div className='mb-4'>
            <label
              htmlFor='password'
              className='block text-sm font-semibold mb-2'
            >
              Password
            </label>
            <InputPassword
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            {errors.password && (
              <p className='text-xs text-destructive mt-2'>{errors.password}</p>
            )}
          </div>
          <Link
            href='/recupera-password'
            prefetch={false}
            className='block text-sm font-semibold text-center mb-8'
          >
            Password dimenticata?
          </Link>
          <Button
            className='w-full'
            type='submit'
            variant='default'
            disabled={isLoading}
          >
            {isLoading ? 'Accesso...' : 'Accedi'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
