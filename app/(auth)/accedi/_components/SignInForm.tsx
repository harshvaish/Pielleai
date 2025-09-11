'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputPassword from '../../../_components/InputPassword';
import { toast } from 'sonner';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInSchema } from '@/lib/validation/auth/signInSchema';
import { authClient, signIn } from '@/lib/auth-client';
import { getBetterAuthErrorMessage, resolveNextPath } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const methods = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmitHandler = async (data: SignInSchema) => {
    const { email, password } = data;

    startTransition(async () => {
      await signIn.email({
        email,
        password,
        fetchOptions: {
          onError: (ctx) => {
            const code = ctx?.error?.code ?? 'UNKNOWN_ERROR';
            const message = getBetterAuthErrorMessage(code);
            toast.error(message);
            return;
          },
        },
      });

      const { data: session, error } = await authClient.getSession({
        query: {
          disableCookieCache: true,
        },
      });

      if (!session || error) {
        toast.error('Impossibile effettuare il login, riprova più tardi.');
        return;
      }

      const redirect = resolveNextPath({
        user: session.user,
        hasProfile: Boolean(session.user.profileId),
      });

      if (redirect) {
        startTransition(() => router.replace(redirect));
        return;
      }

      startTransition(() => router.replace('/eventi'));
    });
  };

  return (
    <Card className='w-full max-w-xl items-center p-6 xl:p-12 rounded-2xl'>
      <CardHeader className='w-full gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold'>Accedi</CardTitle>
      </CardHeader>
      <CardContent className='w-full max-w-sm p-0'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            className='space-y-4 p-2'
          >
            <div>
              <div className='text-sm font-semibold mb-2'>Email</div>
              <Input
                type='email'
                placeholder='esempio@milanoovest.it'
                autoComplete='email'
                {...register('email')}
                className={errors.email ? 'border-destructive text-destructive' : ''}
              />
              {errors.email && (
                <p className='text-xs text-destructive mt-2'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className='text-sm font-semibold mb-2'>Password</div>
              <InputPassword
                {...register('password')}
                error={!!errors.password}
              />
              {errors.password && (
                <p className='text-xs text-destructive mt-2'>{errors.password.message}</p>
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
              disabled={isPending}
            >
              {isPending ? 'Accesso...' : 'Accedi'}
            </Button>

            <Link
              href='/registrati'
              prefetch={false}
              className='block text-sm font-semibold text-center mb-8'
            >
              Non hai un account? Registrati
            </Link>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
