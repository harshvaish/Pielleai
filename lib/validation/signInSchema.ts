import { object, string } from 'zod';

export const signInSchema = object({
  email: string().min(1, 'Email obbligatoria').email('Formato non valido'),
  password: string()
    .min(1, 'Password obbligatoria')
    .min(8, 'Almeno 8 caratteri')
    .max(16, 'Massimo 16 caratteri'),
});
