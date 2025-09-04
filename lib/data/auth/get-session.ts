'server only';

import { auth } from '@/lib/auth';
import { Session } from 'better-auth';
import { User } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function getSession(force: boolean = false): Promise<{
  session: Session | null;
  user: User | null;
}> {
  try {
    const requestHeaders = await headers();

    const response = await auth.api.getSession({
      headers: requestHeaders,
      query: {
        disableCookieCache: force,
      },
    });

    if (!response || !response.session || !response.user) {
      return { session: null, user: null };
    }

    return response;
  } catch (error) {
    console.error('[getSession] - Error:', error);
    return { session: null, user: null };
  }
}
