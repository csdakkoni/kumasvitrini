import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

async function handleCallback(token: string, reqUrl: string) {
    const siteUrl = new URL(reqUrl).origin;

    if (!token) {
        return NextResponse.redirect(`${siteUrl}/sepet?error=no_token`);
    }

    try {
        // Retrieve payment result from Iyzico via raw HTTP
        const apiKey = process.env.IYZICO_API_KEY!;
        const secretKey = process.env.IYZICO_SECRET_KEY!;
        const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

        const uriPath = '/payment/iyzipos/checkoutform/auth/ecom/detail';
        const requestPayload = JSON.stringify({ locale: 'tr', token });
        const randomString = String(process.hrtime.bigint()) + Math.random().toString(8).slice(2);

        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(randomString + uriPath + requestPayload)
            .digest('hex');

        const authorizationParams = [
            'apiKey:' + apiKey,
            'randomKey:' + randomString,
            'signature:' + signature,
        ].join('&');
        const authorization = 'IYZWSv2 ' + Buffer.from(authorizationParams).toString('base64');

        const iyzicoResponse = await fetch(`${baseUrl}${uriPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
                'Accept': 'application/json',
                'x-iyzi-rnd': randomString,
                'x-iyzi-client-version': 'iyzipay-node-2.0.65',
            },
            body: requestPayload,
        });

        const retrieveResult = await iyzicoResponse.json();

        // Use service role Supabase client
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        if (retrieveResult.status === 'success' && retrieveResult.paymentStatus === 'SUCCESS') {
            const basketId = retrieveResult.basketId;

            const { data: orderData } = await supabaseAdmin
                .from('orders')
                .select('id')
                .eq('order_number', basketId)
                .single();

            if (orderData) {
                await supabaseAdmin
                    .from('orders')
                    .update({
                        payment_status: 'paid',
                        status: 'confirmed',
                        payment_id: retrieveResult.paymentId
                    })
                    .eq('id', orderData.id);

                return NextResponse.redirect(`${siteUrl}/siparis-basarili?order=${orderData.id}`);
            } else {
                return NextResponse.redirect(`${siteUrl}/sepet?error=order_not_found`);
            }
        } else {
            console.error('Iyzico Payment Failed:', JSON.stringify(retrieveResult));
            const basketId = retrieveResult.basketId;
            if (basketId) {
                await supabaseAdmin
                    .from('orders')
                    .update({ payment_status: 'failed' })
                    .eq('order_number', basketId);
            }
            return NextResponse.redirect(`${siteUrl}/sepet?error=payment_failed`);
        }

    } catch (error: any) {
        console.error('Iyzico Callback Error:', error);
        return NextResponse.redirect(`${siteUrl}/sepet?error=system_error`);
    }
}

// iyzico sends POST with form-urlencoded body
export async function POST(req: NextRequest) {
    const contentType = req.headers.get('content-type') || '';
    let token = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        token = formData.get('token') as string;
    } else {
        try {
            const body = await req.json();
            token = body.token;
        } catch {
            token = '';
        }
    }

    return handleCallback(token, req.url);
}

// Some iyzico flows redirect as GET with token in query params
export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token') || '';
    return handleCallback(token, req.url);
}

