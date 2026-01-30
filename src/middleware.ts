import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/ask-buddy',
  '/market-transaction',
  '/competition',
  '/new-launches',
  '/our-projects',
  '/personalize-pitches',
  '/sop-policies',
  '/stakeholders',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = req.cookies.get('auth_logged_in')?.value === 'true';

  if (pathname === '/' && isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/ask-buddy';
    return NextResponse.redirect(url);
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/ask-buddy/:path*',
    '/market-transaction/:path*',
    '/competition/:path*',
    '/new-launches/:path*',
    '/our-projects/:path*',
    '/personalize-pitches/:path*',
    '/sop-policies/:path*',
    '/stakeholders/:path*',
  ],
};
