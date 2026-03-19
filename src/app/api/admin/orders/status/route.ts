import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        // Authenticate the user (Admin only)
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (!adminToken) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabaseAdmin
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) {
            console.error('Supabase update error:', error);
            return NextResponse.json({ error: 'Veritabanı güncellenemedi' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
