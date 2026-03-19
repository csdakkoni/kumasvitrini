import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ---- iyzico IYZWSv2 Auth Helper ----
function generateAuthorizationHeader(apiKey: string, secretKey: string, requestBody: string): string {
    const randomHeaderValue = crypto.randomUUID().replace(/-/g, '').substring(0, 8) + String(Date.now());
    const uriPath = '/payment/iyzipos/checkoutform/initialize/auth/ecom';

    const hashStr = randomHeaderValue + uriPath + requestBody;
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(hashStr)
        .digest('base64');

    const authorizationParams = [
        'apiKey:' + apiKey,
        'randomHeaderValue:' + randomHeaderValue,
        'signature:' + signature,
    ].join('&');

    return 'IYZWSv2 ' + Buffer.from(authorizationParams).toString('base64');
}

export async function POST(req: NextRequest) {
    let step = 'init';
    try {
        // Step 0: Check env vars
        step = 'env_check';
        const apiKey = process.env.IYZICO_API_KEY;
        const secretKey = process.env.IYZICO_SECRET_KEY;
        const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

        if (!apiKey || !secretKey) {
            return NextResponse.json({ 
                success: false, 
                error: `Missing iyzico env vars. API_KEY: ${apiKey ? 'SET' : 'MISSING'}, SECRET: ${secretKey ? 'SET' : 'MISSING'}`,
                step 
            }, { status: 500 });
        }

        // Step 1: Parse body
        step = 'parse_body';
        const body = await req.json();
        const { orderData, items } = body;

        if (!orderData || !items) {
            return NextResponse.json({ 
                success: false, 
                error: `Missing orderData or items in request body. Keys: ${Object.keys(body).join(', ')}`,
                step 
            }, { status: 400 });
        }

        // Ensure order_number is created
        orderData.order_number = `KV-${Date.now()}`;
        orderData.payment_method = 'iyzico';

        // Step 2: Create order in DB using service role key (bypasses RLS)
        step = 'db_insert';
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_number: orderData.order_number,
                customer_name: orderData.customer_name,
                customer_phone: orderData.customer_phone,
                customer_email: orderData.customer_email || null,
                status: orderData.status || 'pending',
                subtotal: orderData.subtotal,
                shipping_cost: orderData.shipping_cost,
                total_amount: orderData.total_amount,
                shipping_address: orderData.shipping_address,
                shipping_method: orderData.shipping_method,
                payment_status: orderData.payment_status || 'pending',
                payment_method: orderData.payment_method || 'iyzico',
                notes: orderData.notes || null,
            })
            .select()
            .single();

        if (orderError || !order) {
            console.error('DB Insert Error:', orderError);
            return NextResponse.json({ 
                success: false, 
                error: `DB Error: ${orderError?.message || 'Unknown'}`,
                step 
            }, { status: 500 });
        }

        // Insert order items
        const orderItemsToInsert = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.product_id || null,
            product_name: item.product_name || 'Ürün',
            meters: item.meters,
            unit_price: item.unit_price,
            total_price: item.total_price
        }));

        await supabaseAdmin.from('order_items').insert(orderItemsToInsert);

        // Step 3: Prepare iyzico request payload
        step = 'prepare_iyzico';
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'https';
        const siteBaseUrl = `${protocol}://${host}`;

        const basketItems = items.map((item: any) => ({
            id: String(item.product_id || 'ITEM'),
            name: String(item.product_name || 'Kumaş'),
            category1: "Textile",
            category2: "Kumas",
            itemType: "PHYSICAL",
            price: String(Number(item.total_price || 0).toFixed(2)),
        }));

        const buyerName = (orderData.customer_name || 'Musteri').split(' ');

        const iyzicoPayload = {
            locale: "tr",
            conversationId: String(order.id),
            price: String(Number(orderData.subtotal || orderData.total_amount).toFixed(2)),
            paidPrice: String(Number(orderData.total_amount).toFixed(2)),
            currency: "TRY",
            basketId: String(orderData.order_number),
            paymentGroup: "PRODUCT",
            callbackUrl: `${siteBaseUrl}/api/checkout/callback`,
            enabledInstallments: [1, 2, 3, 6, 9],
            buyer: {
                id: String(orderData.customer_email || `GUEST-${Date.now()}`),
                name: String(buyerName[0] || "Musteri"),
                surname: String(buyerName.slice(1).join(' ') || "Soyadi"),
                gsmNumber: String(orderData.customer_phone || "+905000000000"),
                email: String(orderData.customer_email || "misafir@kumasvitrini.com"),
                identityNumber: "11111111111",
                lastLoginDate: "2025-01-01 12:00:00",
                registrationDate: "2025-01-01 12:00:00",
                registrationAddress: String(orderData.shipping_address?.address_line1 || "Adres"),
                ip: String(req.headers.get('x-forwarded-for') || "85.105.0.1"),
                city: String(orderData.shipping_address?.city || "Istanbul"),
                country: "Turkey",
                zipCode: String(orderData.shipping_address?.postal_code || "34000")
            },
            shippingAddress: {
                contactName: String(orderData.shipping_address?.full_name || orderData.customer_name || "Musteri"),
                city: String(orderData.shipping_address?.city || "Istanbul"),
                country: "Turkey",
                address: String(orderData.shipping_address?.address_line1 || "Adres"),
                zipCode: String(orderData.shipping_address?.postal_code || "34000")
            },
            billingAddress: {
                contactName: String(orderData.shipping_address?.full_name || orderData.customer_name || "Musteri"),
                city: String(orderData.shipping_address?.city || "Istanbul"),
                country: "Turkey",
                address: String(orderData.shipping_address?.address_line1 || "Adres"),
                zipCode: String(orderData.shipping_address?.postal_code || "34000")
            },
            basketItems: basketItems
        };

        // Step 4: Call iyzico REST API directly (no npm package needed)
        step = 'iyzico_call';
        const requestBodyStr = JSON.stringify(iyzicoPayload);
        const authorization = generateAuthorizationHeader(apiKey, secretKey, requestBodyStr);

        const iyzicoUrl = `${baseUrl}/payment/iyzipos/checkoutform/initialize/auth/ecom`;

        const iyzicoResponse = await fetch(iyzicoUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
                'Accept': 'application/json',
            },
            body: requestBodyStr,
        });

        step = 'iyzico_response';
        const iyzicoData = await iyzicoResponse.json();

        if (iyzicoData.status !== 'success') {
            console.error("Iyzico Error:", JSON.stringify(iyzicoData));
            return NextResponse.json({ 
                success: false, 
                error: iyzicoData.errorMessage || "Iyzico initialization failed",
                errorCode: iyzicoData.errorCode,
                step 
            }, { status: 500 });
        }

        // Return token and HTML content to client
        return NextResponse.json({
            success: true,
            checkoutFormContent: iyzicoData.checkoutFormContent,
            token: iyzicoData.token,
            orderId: order.id
        });

    } catch (error: any) {
        console.error(`Iyzico Error at step [${step}]:`, error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Payment initialization failed',
            step 
        }, { status: 500 });
    }
}
