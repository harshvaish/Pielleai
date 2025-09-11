import { createAuthClient } from 'better-auth/react';
import { adminClient, emailOTPClient } from 'better-auth/client/plugins';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from '@/lib/auth';
import { adminConfig } from './permissions';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [adminClient(adminConfig), inferAdditionalFields<typeof auth>(), emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession, forgetPassword, resetPassword, emailOtp } =
  authClient;
