import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
// Simple token: hash of username + password + a secret
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'grohn-admin-secret-2024';

function generateToken(): string {
    // Simple but effective: create a token from the secret + timestamp
    const payload = `${ADMIN_TOKEN_SECRET}-${Date.now()}`;
    // Base64 encode as a simple token
    return Buffer.from(payload).toString('base64');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const token = generateToken();
            const cookieStore = await cookies();

            cookieStore.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: 'Kullanıcı adı veya şifre hatalı' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
