import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin-token');
  const { pathname } = request.nextUrl;

  // 1. Protected admin routes — redirect to login if no session cookie
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token?.value) {
      // No token -> redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
