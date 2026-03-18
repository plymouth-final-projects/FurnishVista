import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookie = request.headers.get('cookie');

  if (!cookie) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        cookie,
        accept: 'application/json',
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authenticated = await isAuthenticated(request);

  if (AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    if (authenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  }

  if (!authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/forgot-password',
    '/dashboard/:path*',
    '/designs/:path*',
    '/editor/:path*',
    '/rooms/:path*',
    '/settings/:path*',
  ],
};
