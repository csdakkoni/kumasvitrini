import { NextRequest, NextResponse } from 'next/server';
import iyzipay from '@/lib/iyzipay';
import { createOrder } from '@/lib/services/api';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderData, items } = body;

        // Ensure order_number is created
        orderData.order_number = `KV-${Date.now()}`;
        orderData.payment_method = 'iyzico';

        // 1. Create the Order in Supabase First
        const orderRes = await createOrder(orderData, items);
        
        if (!orderRes || !orderRes.id) {
            throw new Error('Failed to create order in database');
        }

        // 2. Prepare Iyzipay Request
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const baseUrl = `${protocol}://${host}`;

        const basketItems = items.map((item: any) => ({
            id: item.product_id,
            name: item.product_name,
            category1: "Textile",
            category2: item.product_slug || "Kumas",
            itemType: "PHYSICAL", // Iyzipay.BASKET_ITEM_TYPE.PHYSICAL
            price: item.total_price.toFixed(2),
        }));

        const request = {
            locale: "TR", // Iyzipay.LOCALE.TR
            conversationId: orderRes.id,
            price: orderData.subtotal.toFixed(2),
            paidPrice: orderData.total_amount.toFixed(2),
            currency: "TRY", // Iyzipay.CURRENCY.TRY
            basketId: orderData.order_number,
            paymentGroup: "PRODUCT", // Iyzipay.PAYMENT_GROUP.PRODUCT
            callbackUrl: `${baseUrl}/api/checkout/callback`,
            enabledInstallments: [2, 3, 6, 9],
            buyer: {
                id: orderData.customer_email || `GUEST-${Date.now()}`,
                name: orderData.customer_name.split(' ')[0] || "Musteri",
                surname: orderData.customer_name.split(' ').slice(1).join(' ') || "Soyadi",
                gsmNumber: orderData.customer_phone,
                email: orderData.customer_email || "test@kumasvitrini.com", // Iyzico requires email
                identityNumber: "11111111111", // Standard placeholder for anonymous B2C
                lastLoginDate: "2023-01-08 15:12:09",
                registrationDate: "2023-01-08 15:12:09",
                registrationAddress: orderData.shipping_address.address_line1,
                ip: req.headers.get('x-forwarded-for') || "127.0.0.1",
                city: orderData.shipping_address.city,
                country: "Turkey",
                zipCode: orderData.shipping_address.postal_code || "34000"
            },
            shippingAddress: {
                contactName: orderData.shipping_address.full_name,
                city: orderData.shipping_address.city,
                country: "Turkey",
                address: orderData.shipping_address.address_line1,
                zipCode: orderData.shipping_address.postal_code || "34000"
            },
            billingAddress: {
                contactName: orderData.shipping_address.full_name,
                city: orderData.shipping_address.city,
                country: "Turkey",
                address: orderData.shipping_address.address_line1,
                zipCode: orderData.shipping_address.postal_code || "34000"
            },
            basketItems: basketItems
        };

        // 3. Call Iyzico
        const checkoutFormInitialize = await new Promise<any>((resolve, reject) => {
            iyzipay.checkoutFormInitialize.create(request as any, (err: any, result: any) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (checkoutFormInitialize.status !== 'success') {
            console.error("Iyzico Error:", checkoutFormInitialize);
            throw new Error(checkoutFormInitialize.errorMessage || "Iyzico initialization failed");
        }

        // Return token and HTML content to client
        return NextResponse.json({
            success: true,
            checkoutFormContent: checkoutFormInitialize.checkoutFormContent,
            token: checkoutFormInitialize.token,
            orderId: orderRes.id
        });

    } catch (error: any) {
        console.error('Iyzico Init Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Payment initialization failed' 
        }, { status: 500 });
    }
}
