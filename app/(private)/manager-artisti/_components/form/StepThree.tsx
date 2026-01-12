import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { ArtistManagerS3FormSchema } from '@/lib/validation/artist-manager-form-schema';

export default function StepThree() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ArtistManagerS3FormSchema>();

  return (
    <>
      <div className='text-xl text-center font-bold'>Credenziali</div>
      <div className='flex flex-col'>
        <label
          htmlFor='signUpEmail'
          className='block text-sm font-semibold mb-2'
        >
          Email di accesso <span className='text-muted-foreground font-normal'>(opzionale)</span>
        </label>
        <Input
          id='signUpEmail'
          {...register('signUpEmail')}
          placeholder="Inserisci l'email di accesso"
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
          Password di accesso <span className='text-muted-foreground font-normal'>(opzionale)</span>
        </label>
        <Input
          id='signUpPassword'
          {...register('signUpPassword')}
          placeholder='Inserisci la password di accesso'
          className={errors.signUpPassword ? 'border-destructive text-destructive' : ''}
        />
        {errors.signUpPassword && (
          <p className='text-xs text-destructive mt-2'>{errors.signUpPassword.message as string}</p>
        )}
      </div>
    </>
  );
}
