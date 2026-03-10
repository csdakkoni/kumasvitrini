import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (!request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Also protect /api/admin routes
    const isAdminRoute =
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/api/admin');

    if (!isAdminRoute) {
        return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');

    if (authHeader) {
        const [scheme, encoded] = authHeader.split(' ');

        if (scheme === 'Basic' && encoded) {
            const decoded = atob(encoded);
            const [user, password] = decoded.split(':');

            const adminUser = process.env.ADMIN_USERNAME || 'admin';
            const adminPass = process.env.ADMIN_PASSWORD;

            // If no password is set, allow access (dev mode)
            if (!adminPass) {
                return NextResponse.next();
            }

            if (user === adminUser && password === adminPass) {
                return NextResponse.next();
            }
        }
    }

    // Return 401 with basic auth challenge
    return new NextResponse('Yetkilendirme gerekli', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Admin Panel"',
        },
    });
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
