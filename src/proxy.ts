import { NextResponse, NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('admin-token');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/setup') {
    if (!token?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
