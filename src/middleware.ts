import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_development_only");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secretKey);
      const position = (payload.position as string)?.toLowerCase() || "";

      // RBAC for team management
      if (request.nextUrl.pathname.startsWith('/admin/team')) {
        const allowedRoles = ["secretary", "secy", "representative", "rep", "admin"];
        if (!allowedRoles.includes(position)) {
          // If a coordinator/mentor/member tries to access Team, redirect them to overview
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }

      // RBAC for gallery management
      if (request.nextUrl.pathname.startsWith('/admin/gallery')) {
        const restrictedRoles = ["member"];
        if (restrictedRoles.includes(position)) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
