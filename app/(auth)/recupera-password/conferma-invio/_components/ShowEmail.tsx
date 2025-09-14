'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RPE_EMAIL_STORAGE_NAME } from '@/lib/constants';
import { emailValidation } from '@/lib/validation/_general';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ShowEmail() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem(RPE_EMAIL_STORAGE_NAME);
    const validation = emailValidation.safeParse(email);

    if (!validation.success) {
      localStorage.removeItem(RPE_EMAIL_STORAGE_NAME);
      router.replace('/recupera-password');
    }

    setEmail(email);
  }, [router]);

  return email ? <strong>{email}</strong> : <Skeleton />;
}
