import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) return null;
    return createClient(url, serviceKey);
}

export async function GET() {
    const supabase = getAdminClient();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase yapılandırılmamış' }, { status: 500 });
    }

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ categories: data });
}

export async function POST(request: Request) {
    // Authenticate the user (Admin only)
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!adminToken) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const supabase = getAdminClient();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase yapılandırılmamış' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { data, error } = await supabase
            .from('categories')
            .insert({
                name: body.name,
                slug: body.slug,
                description: body.description,
                image_url: body.image_url,
                sort_order: body.sort_order,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: `Supabase hatası: ${error.message}` }, { status: 400 });
        }

        return NextResponse.json({ category: data }, { status: 201 });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

