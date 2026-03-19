import { NextRequest, NextResponse } from 'next/server';
import { createUpsLabel } from '@/lib/services/ups';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
    try {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const order: Order = await req.json();

        if (!order || !order.id || !order.shipping_address) {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        // Generate UPS Label
        const upsResponse = await createUpsLabel(order);

        const shipmentResults = upsResponse.ShipmentResponse?.ShipmentResults;
        if (!shipmentResults) {
            throw new Error('Invalid UPS response format');
        }

        const trackingNumber = shipmentResults.ShipmentIdentificationNumber;
        const labelBase64 = shipmentResults.PackageResults?.[0]?.ShippingLabel?.GraphicImage;

        if (!trackingNumber || !labelBase64) {
            throw new Error('Label data missing from UPS response');
        }

        // Save tracking number to Supabase
        const { error: updateError } = await supabase
            .from('orders')
            .update({ 
                tracking_number: trackingNumber,
                status: 'shipped' // Optionally auto-update status
            })
            .eq('id', order.id);

        if (updateError) {
            console.error('Failed to save tracking number to DB:', updateError);
            // We still return the label so the user isn't stuck, but log the error
        }

        return NextResponse.json({
            success: true,
            trackingNumber,
            labelBase64
        });

    } catch (error: any) {
        console.error('UPS API Route Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Failed to generate UPS label' 
        }, { status: 500 });
    }
}
