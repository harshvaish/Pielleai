'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { signUpSchema, SignUpSchema } from '@/lib/validation/auth/sign-up-schema';
import InputPassword from '@/app/_components/InputPassword';
import { Checkbox } from '@/components/ui/checkbox';
import { CE_BLOCK_STORAGE_NAME, CE_EMAIL_STORAGE_NAME } from '@/lib/constants';
import { signUp } from '@/lib/server-actions/auth/sign-up';

export default function SignUpForm() {
  const router = useRouter();
  const methods = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmitHandler = async (data: SignUpSchema) => {
    const response = await signUp(data);

    if (!response.success) {
      toast.error(response.message ?? 'Creazione account non riuscita.');
      return;
    }

    const { email } = data;

    localStorage.setItem(CE_EMAIL_STORAGE_NAME, email);
    localStorage.setItem(CE_BLOCK_STORAGE_NAME, Date.now().toString());
    router.replace('/conferma-email');
  };

  return (
    <Card className='w-full max-w-xl max-h-max items-center p-6 xl:p-12 rounded-2xl'>
      <CardHeader className='w-full gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold'>Registrati</CardTitle>
      </CardHeader>
      <CardContent className='w-full max-w-sm p-0'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            className='space-y-4'
          >
            <div>
              <div className='text-sm font-semibold mb-2'>Email</div>
              <Input
                type='email'
                placeholder='esempio@milanoovest.it'
                autoComplete='email'
                autoFocus={true}
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

            <div className='flex flex-col'>
              <div className='flex items-center space-x-2'>
                <Controller
                  control={control}
                  name='acceptTerms'
                  render={({ field }) => (
                    <Checkbox
                      id='acceptTerms'
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  )}
                />
                <label
                  htmlFor='acceptTerms'
                  className={cn('text-xs font-normal', errors.acceptTerms && 'text-destructive')}
                >
                  Accetto i{' '}
                  <span className='underline underline-offset-2 hover:cursor-pointer'>
                    Termini e le Condizioni
                  </span>{' '}
                  e l&apos;{' '}
                  <span className='underline underline-offset-2 hover:cursor-pointer'>
                    Informativa sulla Privacy
                  </span>{' '}
                  della piattaforma.
                </label>
              </div>
              {errors.acceptTerms && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.acceptTerms.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='flex items-center space-x-2'>
                <Controller
                  control={control}
                  name='freeOfBooking'
                  render={({ field }) => (
                    <Checkbox
                      id='freeOfBooking'
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  )}
                />
                <label
                  htmlFor='freeOfBooking'
                  className={cn('text-xs font-normal', errors.freeOfBooking && 'text-destructive')}
                >
                  Dichiaro di essere free of booking.
                </label>
              </div>
              {errors.freeOfBooking && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.freeOfBooking.message as string}
                </p>
              )}
            </div>

            <Button
              className='w-full'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrazione...' : 'Continua'}
            </Button>

            <Link
              href='/accedi'
              prefetch={false}
              className='block text-sm font-semibold text-center mb-8'
            >
              Hai già un account? Accedi
            </Link>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
