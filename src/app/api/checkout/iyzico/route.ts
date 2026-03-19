import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/services/api';

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

        // Step 2: Create order in DB
        step = 'db_insert';
        const orderRes = await createOrder(orderData, items);
        
        if (!orderRes || !orderRes.id) {
            return NextResponse.json({ 
                success: false, 
                error: 'Failed to create order in database',
                step 
            }, { status: 500 });
        }

        // Step 3: Prepare iyzico request
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

        const request = {
            locale: "tr",
            conversationId: String(orderRes.id),
            price: String(Number(orderData.subtotal || orderData.total_amount).toFixed(2)),
            paidPrice: String(Number(orderData.total_amount).toFixed(2)),
            currency: "TRY",
            basketId: String(orderData.order_number),
            paymentGroup: "PRODUCT",
            callbackUrl: `${siteBaseUrl}/api/checkout/callback`,
            enabledInstallments: [2, 3, 6, 9],
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

        // Step 4: Initialize iyzipay dynamically (avoid import issues)
        step = 'iyzico_init';
        const Iyzipay = (await import('iyzipay')).default;
        const iyzipayClient = new Iyzipay({
            apiKey: apiKey,
            secretKey: secretKey,
            uri: baseUrl
        });

        // Step 5: Call Iyzico
        step = 'iyzico_call';
        const checkoutFormInitialize = await new Promise<any>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Iyzico timeout after 15s')), 15000);
            iyzipayClient.checkoutFormInitialize.create(request as any, (err: any, result: any) => {
                clearTimeout(timeout);
                if (err) return reject(err);
                resolve(result);
            });
        });

        step = 'iyzico_response';
        if (checkoutFormInitialize.status !== 'success') {
            console.error("Iyzico Error:", JSON.stringify(checkoutFormInitialize));
            return NextResponse.json({ 
                success: false, 
                error: checkoutFormInitialize.errorMessage || "Iyzico initialization failed",
                errorCode: checkoutFormInitialize.errorCode,
                iyzicoRaw: checkoutFormInitialize,
                step 
            }, { status: 500 });
        }

        // Return token and HTML content to client
        return NextResponse.json({
            success: true,
            checkoutFormContent: checkoutFormInitialize.checkoutFormContent,
            token: checkoutFormInitialize.token,
            orderId: orderRes.id
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
