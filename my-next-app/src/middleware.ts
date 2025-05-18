import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/bbs/create', '/bbs/update', '/user/profile'];
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    const hasToken = request.cookies.has('accessToken');

    if (!hasToken) {
      // ログインしてない場合ログインページ
      const loginUrl = new URL('/user/signin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bbs/:path*', '/user/:path*'],
};