import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role client for admin operations
function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        return null;
    }

    return createClient(url, serviceKey);
}

// POST - Create product
export async function POST(request: NextRequest) {
    const supabase = getAdminClient();

    if (!supabase) {
        return NextResponse.json(
            { error: 'Supabase yapılandırılmamış. Environment variables kontrol edin.' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();

        const { data, error } = await supabase
            .from('products')
            .insert({
                name: body.name,
                slug: body.slug,
                category_id: body.category_id || null,
                description: body.description,
                price_per_meter: body.price_per_meter,
                original_price: body.original_price,
                min_order_meters: body.min_order_meters,
                stock_meters: body.stock_meters,
                width_cm: body.width_cm,
                weight_gsm: body.weight_gsm,
                composition: body.composition,
                colors: body.colors,
                images: body.images || [],
                is_active: body.is_active,
                is_featured: body.is_featured,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ product: data }, { status: 201 });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

// GET - List products
export async function GET() {
    const supabase = getAdminClient();

    if (!supabase) {
        return NextResponse.json(
            { error: 'Supabase yapılandırılmamış' },
            { status: 500 }
        );
    }

    const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ products: data });
}
