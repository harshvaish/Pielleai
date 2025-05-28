import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PUBLIC_ROUTES = [
  '/accedi',
  '/recupera-password',
  '/recupera-password/conferma-invio',
  '/cambia-password',
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
      return NextResponse.redirect(new URL('/', request.url));
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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
