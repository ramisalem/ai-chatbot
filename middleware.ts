import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isDevelopmentEnvironment } from './lib/constants';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith('/ping')) {
    return new Response('pong', { status: 200 });
  }

  // Handle API routes without i18n - completely skip auth middleware for auth APIs
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Simple locale routing
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  // Run auth middleware for protected routes
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const cleanPathname = localeMatch ? pathname.replace(/^\/[a-z]{2}/, '') || '/' : pathname;
  
  // Skip auth for login and register pages
  if (['/login', '/register'].includes(cleanPathname)) {
    return NextResponse.next();
  }

  // Run auth middleware for all other routes
  return runAuthMiddleware(request);
}

async function runAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if we're in a locale-prefixed route
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : defaultLocale;
  const cleanPathname = localeMatch ? pathname.replace(/^\/[a-z]{2}/, '') || '/' : pathname;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (token && ['/login', '/register'].includes(cleanPathname)) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
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
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
