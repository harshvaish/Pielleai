import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PUBLIC_ROUTES = [
  '/registrati',
  '/conferma-email',
  '/accedi',
  '/recupera-password',
  '/recupera-password/conferma-invio',
  '/reset-password',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = getSessionCookie(request, {
    cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX,
  });

  const isLoggedIn = !!sessionToken;

  if (PUBLIC_ROUTES.includes(pathname)) {
    // Already signed-in? – don’t show the auth page again
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/eventi', request.url));
    }
    // Guest? – allow the request to continue
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/accedi', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
