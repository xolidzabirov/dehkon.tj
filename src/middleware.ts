import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/cart'];
const roleRoutes: Record<string, string[]> = {
  '/seller': ['Seller', 'Admin'],
  '/courier': ['Courier', 'Admin'],
  '/admin': ['Admin'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('dehkon_token')?.value;

  // Check protected routes
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !token) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based routes
  for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      if (!token) {
        const loginUrl = new URL('/auth', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      // Role checking is handled client-side since JWT decoding
      // in edge middleware requires additional setup.
      // The client-side components redirect unauthorized roles.
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/cart/:path*', '/seller/:path*', '/courier/:path*', '/admin/:path*'],
};
