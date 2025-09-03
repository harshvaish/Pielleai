import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { database } from '@/lib/database/connection';
import * as schema from '@/lib/database/schema';
import { nextCookies } from 'better-auth/next-js';
import { sendResetPasswordEmail } from './server-actions/send-reset-password-email';
import { admin } from 'better-auth/plugins/admin';
import { emailOTP } from 'better-auth/plugins';
import { adminConfig } from './permissions';
import { sendOTPEmail } from './server-actions/send-otp-email';

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: 'pg',
    schema: schema,
    usePlural: true,
  }),
  user: {
    additionalFields: {
      status: {
        type: schema.userStatus.enumValues,
        required: true,
        input: true,
        returned: true,
        defaultValue: 'waiting-for-approval',
      },
      role: {
        type: schema.userRoles.enumValues,
        required: true,
        input: true,
        returned: true,
        defaultValue: 'user',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    disableSignUp: false,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 ora
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, user.name, url);
    },
    minPasswordLength: 8,
    maxPasswordLength: 16,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 1mo
    disableSessionRefresh: true,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5min
    },
  },
  advanced: {
    cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX,
  },
  plugins: [
    nextCookies(),
    admin(adminConfig),
    emailOTP({
      expiresIn: 300, // 5min
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          await sendOTPEmail(email, otp);
        }
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = (typeof auth.$Infer.Session)['user'];
