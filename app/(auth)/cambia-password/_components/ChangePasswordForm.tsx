'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { changePasswordSchema } from '@/lib/validation/changePasswordSchema';
import InputPassword from '@/app/(auth)/accedi/_components/InputPassword';
import { resetPassword } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function ChangePasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const validation = changePasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const validationErrors = {
        password: '',
        confirmPassword: '',
      };
      validation.error.errors.forEach((e) => {
        if (e.path.includes('password')) validationErrors.password = e.message;
        if (e.path.includes('confirmPassword'))
          validationErrors.confirmPassword = e.message;
      });
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    } else {
      setErrors({});
    }

    await resetPassword({
      newPassword: password,
      token: token,
      fetchOptions: {
        onError: (ctx) => {
          console.dir(ctx.error, { depth: null });
          toast.error('Aggiornamento password non riuscito, riprova più tardi');
        },
        onSuccess: () => {
          toast.success('Password aggiornata!');
          setTimeout(() => router.push('/accedi'), 3000);
        },
      },
    });
  };

  return (
    <Card className='w-full max-w-xl items-center p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardHeader className='w-full max-w-sm gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold mb-2'>
          Cambia password
        </CardTitle>
        <CardDescription>
          Crea una password sicura per proteggere il tuo account
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full max-w-sm p-0'>
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className='mb-4'>
            <label
              htmlFor='password'
              className='block text-sm font-semibold mb-2'
            >
              Nuova password
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
          <div className='mb-8'>
            <label
              htmlFor='confirm-password'
              className='block text-sm font-semibold mb-2'
            >
              Conferma nuova password
            </label>
            <InputPassword
              id='confirm-password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className='text-xs text-destructive mt-2'>
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <Button
            className='w-full mb-12'
            type='submit'
            variant='default'
            disabled={isLoading}
          >
            {isLoading ? 'Cambio password...' : 'Cambia password'}
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
