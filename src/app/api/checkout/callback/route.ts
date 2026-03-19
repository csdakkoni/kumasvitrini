import { NextRequest, NextResponse } from 'next/server';
import iyzipay from '@/lib/iyzipay';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        // Iyzico sends a form-urlencoded POST
        const contentType = req.headers.get('content-type') || '';
        let token = '';

        if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            token = formData.get('token') as string;
        } else {
            const body = await req.json();
            token = body.token;
        }

        if (!token) {
            return NextResponse.redirect(new URL('/sepet?error=no_token', req.url));
        }

        // Retrieve payment details from Iyzico
        const retrieveResult = await new Promise<any>((resolve, reject) => {
            iyzipay.checkoutForm.retrieve({
                locale: 'TR',
                token: token
            }, (err: any, result: any) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (retrieveResult.status === 'success' && retrieveResult.paymentStatus === 'SUCCESS') {
            const basketId = retrieveResult.basketId; // This is our order_number

            // 1. Get the order ID from our DB
            const { data: orderData } = await supabase
                .from('orders')
                .select('id')
                .eq('order_number', basketId)
                .single();

            if (orderData) {
                // 2. Update the Database
                await supabase
                    .from('orders')
                    .update({
                        payment_status: 'paid',
                        status: 'confirmed',
                        payment_id: retrieveResult.paymentId
                    })
                    .eq('id', orderData.id);

                // 3. Redirect to success
                return NextResponse.redirect(new URL(`/siparis-basarili?order=${orderData.id}`, req.url));
            } else {
                return NextResponse.redirect(new URL(`/sepet?error=order_not_found`, req.url));
            }
        } else {
            console.error('Iyzico Payment Failed:', retrieveResult);
            // Even if failed, mark payment_status as failed if we know the basketId
            const basketId = retrieveResult.basketId;
            if (basketId) {
                await supabase
                    .from('orders')
                    .update({ payment_status: 'failed' })
                    .eq('order_number', basketId);
            }
            return NextResponse.redirect(new URL('/sepet?error=payment_failed', req.url));
        }

    } catch (error: any) {
        console.error('Iyzico Callback Error:', error);
        return NextResponse.redirect(new URL('/sepet?error=system_error', req.url));
    }
}
