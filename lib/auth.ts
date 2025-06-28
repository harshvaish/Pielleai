import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { database } from '@/lib/database/connection';
import * as schema from '@/lib/database/schema';
import { nextCookies } from 'better-auth/next-js';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { sendResetPasswordEmailAction } from './server-actions/send-reset-password-email.action';
import { admin } from 'better-auth/plugins/admin';
import { adminConfig } from './permissions';

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: 'pg',
    schema: schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    disableSignUp: false,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 ora
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmailAction(user.email, user.name, url);
    },
    minPasswordLength: 8,
    maxPasswordLength: 16,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 1 mese
  },
  advanced: {
    cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-in/email') return;

      const email = ctx.body?.email as string | undefined;
      if (!email) return;

      const user: User | null = await ctx.context.adapter.findOne({
        model: 'user',
        where: [{ field: 'email', operator: 'eq', value: email }],
      });

      if (!user) return;

      if (user.role !== 'admin') {
        throw new APIError('UNAUTHORIZED', {
          code: 'NOT_ADMIN_USER',
          message:
            'Solo gli amministratori possono accedere a questa piattaforma',
        });
      }
    }),
  },
  plugins: [nextCookies(), admin(adminConfig)],
});

export type User = (typeof auth.$Infer.Session)['user'];
