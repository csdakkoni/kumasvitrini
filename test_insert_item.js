require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    console.log("Testing insert item...");
    
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            order_number: "KV-" + Date.now(),
            customer_name: "Test User",
            customer_phone: "5555555555",
            customer_email: "test@example.com",
            status: "pending",
            billing_info: {},
            total_amount: 100.50,
            shipping_cost: 0,
            shipping_address: { city: "Test" },
            shipping_method: "UPS",
            payment_status: "pending",
            notes: "Test"
        })
        .select()
        .single();
        
    if (orderError) {
        console.error("Order Insert:", orderError);
        return;
    }
    console.log("Order OK:", order.id);

    // Test Item
    const { data: item, error: itemError } = await supabase
        .from('order_items')
        .insert({
            order_id: order.id,
            product_name: "Test",
            meters: 2,
            unit_price: 50,
            total_price: 100
        })
        .select()
        .single();
        
    if (itemError) {
        console.error("Item Object:", itemError);
    } else {
        console.log("Item OK.");
    }
    
    await supabase.from('orders').delete().eq('id', order.id);
    console.log("Done.");
}

check();
