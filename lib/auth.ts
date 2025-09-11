import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { database } from '@/lib/database/connection';
import * as schema from '@/lib/database/schema';
import { nextCookies } from 'better-auth/next-js';
import { sendResetPasswordEmail } from './server-actions/send-reset-password-email';
import { admin } from 'better-auth/plugins/admin';
import { customSession, emailOTP } from 'better-auth/plugins';
import { adminConfig } from './permissions';
import { sendOTPEmail } from './server-actions/send-otp-email';
import { getUserProfileIdCached } from './cache/users';

const options = {
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
      profileId: {
        type: 'number',
        required: false,
        input: false,
        returned: true,
        defaultValue: null,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    disableSignUp: false,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, user.name, url);
    },
    minPasswordLength: 8,
    maxPasswordLength: 16,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 1 month
    // disableSessionRefresh: false,
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 5 * 60, // 5 min
    // },
  },
  advanced: {
    cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX,
  },
  plugins: [
    nextCookies(),
    admin(adminConfig),
    emailOTP({
      expiresIn: 60 * 5, // 5 min
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          await sendOTPEmail(email, otp);
        }
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      const profileId = await getUserProfileIdCached(user.id);
      return {
        user: {
          ...user,
          profileId: profileId ?? null,
        },
        session,
      };
    }, options),
  ],
});

export type Session = (typeof auth.$Infer.Session)['session'];
export type User = (typeof auth.$Infer.Session)['user'];
