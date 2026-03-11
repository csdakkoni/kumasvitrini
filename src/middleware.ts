import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow login page and login/logout API without auth
    if (
        pathname === '/admin/giris' ||
        pathname === '/api/admin/login' ||
        pathname === '/api/admin/logout'
    ) {
        return NextResponse.next();
    }

    // Protect /admin and /api/admin routes
    const isProtected =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/api/admin');

    if (!isProtected) {
        return NextResponse.next();
    }

    // Check for admin cookie
    const adminToken = request.cookies.get('admin_token');

    if (adminToken?.value) {
        return NextResponse.next();
    }

    // For API routes, return 401 JSON
    if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
            { error: 'Yetkilendirme gerekli' },
            { status: 401 }
        );
    }

    // For page routes, redirect to login
    const loginUrl = new URL('/admin/giris', request.url);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
