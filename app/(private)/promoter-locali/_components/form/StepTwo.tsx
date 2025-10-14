import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { VenueManagerS2FormSchema } from '@/lib/validation/venue-manager-form-schema';

export default function StepTwo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<VenueManagerS2FormSchema>();

  return (
    <>
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
          placeholder="Inserisci l'email"
          className={errors.signUpEmail ? 'border-destructive text-destructive' : ''}
        />
        {errors.signUpEmail && (
          <p className='text-xs text-destructive mt-2'>{errors.signUpEmail.message as string}</p>
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
          placeholder='Inserisci la password'
          className={errors.signUpPassword ? 'border-destructive text-destructive' : ''}
        />
        {errors.signUpPassword && (
          <p className='text-xs text-destructive mt-2'>{errors.signUpPassword.message as string}</p>
        )}
      </div>
    </>
  );
}
