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
import { resetPasswordSchema } from '@/lib/validation/resetPasswordSchema';
import InputPassword from '@/app/_components/InputPassword';
import { resetPassword } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const validation = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const validationErrors = {
        password: '',
        confirmPassword: '',
      };
      validation.error.issues.forEach((e) => {
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
          toast.error('Reset password non riuscito, riprova più tardi');
        },
        onSuccess: () => {
          toast.success('Password resettata!');
          setTimeout(() => router.push('/accedi'), 3000);
        },
      },
    });
  };

  const openModal = () => {
    if (password.length > 0 || confirmPassword.length > 0) {
      setIsDialogOpen(true);
    } else {
      router.replace('/accedi');
    }
  };

  return (
    <>
      <Card className='w-full max-w-xl items-center p-6 md:p-8 rounded-2xl'>
        <CardHeader className='w-full max-w-sm gap-0 text-center p-0'>
          <CardTitle className='text-2xl font-semibold mb-2'>
            Reset password
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
                error={!!errors.password}
              />
              {errors.password && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.password}
                </p>
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
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <Button
              className='w-full mb-8'
              type='submit'
              variant='default'
              disabled={isLoading}
            >
              {isLoading ? 'Reset password...' : 'Reset password'}
            </Button>
          </form>
          <div className='flex justify-center'>
            <Button
              className='text-sm text-zinc-600 font-medium'
              variant='ghost'
              onClick={openModal}
            >
              <ArrowLeft
                size={16}
                className='text-muted-foreground'
              />
              Torna al login
            </Button>
          </div>
        </CardContent>
      </Card>

      {isDesktop ? (
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sei sicuro di voler uscire?</DialogTitle>
              <DialogDescription>
                Il processo verrà interrotto e i dati verranno persi.
              </DialogDescription>
              <div className='flex justify-end gap-2 mt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsDialogOpen(false)}
                >
                  Rimani
                </Button>
                <Link
                  href='/accedi'
                  prefetch={false}
                >
                  <Button
                    variant='destructive'
                    size='sm'
                  >
                    Esci
                  </Button>
                </Link>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DrawerContent>
            <DrawerHeader className='mb-20'>
              <DrawerTitle className='text-xl'>
                Sei sicuro di voler uscire?
              </DrawerTitle>
              <DrawerDescription className='text-base'>
                Il processo verrà interrotto e i dati verranno persi.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className='grid grid-cols-2 gap-4'>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen(false)}
              >
                Rimani
              </Button>
              <Link
                href='/accedi'
                prefetch={false}
              >
                <Button
                  variant='destructive'
                  className='w-full'
                >
                  Esci
                </Button>
              </Link>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
