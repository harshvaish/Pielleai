import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

export default function StepThree() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className='text-xl text-center font-bold'>Credenziali</div>
      <div className='flex flex-col'>
        <label
          htmlFor='signUpEmail'
          className='block text-sm font-semibold mb-2'
        >
          Email di accesso
        </label>
        <Input
          id='signUpEmail'
          {...register('signUpEmail')}
          placeholder='info@eaglebooking.it'
          className={
            errors.signUpEmail ? 'border-destructive text-destructive' : ''
          }
        />
        {errors.signUpEmail && (
          <p className='text-xs text-destructive mt-2'>
            {errors.signUpEmail.message as string}
          </p>
        )}
      </div>
      <div className='flex flex-col'>
        <label
          htmlFor='signUpPassword'
          className='block text-sm font-semibold mb-2'
        >
          Password di accesso
        </label>
        <Input
          id='signUpPassword'
          {...register('signUpPassword')}
          placeholder='********'
          className={
            errors.signUpPassword ? 'border-destructive text-destructive' : ''
          }
        />
        {errors.signUpPassword && (
          <p className='text-xs text-destructive mt-2'>
            {errors.signUpPassword.message as string}
          </p>
        )}
      </div>
    </>
  );
}
