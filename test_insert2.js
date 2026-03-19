const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("Testing simplified order insert directly to Supabase...");
    
    const orderData = {
        order_number: `KV-${Date.now()}`,
        customer_name: "Test User",
        customer_phone: "5551234567",
        customer_email: "test@example.com",
        status: "pending",
        shipping_cost: 0,
        subtotal: 100,
        total_amount: 100,
        shipping_address: { city: "Istanbul", address_line1: "Test" },
        shipping_method: "Test Cargo",
        payment_method: "iyzico",
        payment_status: "pending",
        notes: "Test API order"
    };

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
        
    if (orderError) {
        console.error("Order Insert Error:", orderError);
        return;
    }
    
    console.log("Success! Inserted Order:", order.id);
    
    const itemData = {
        order_id: order.id,
        product_id: null,
        product_name: "Test Product (Red)",
        meters: 2,
        unit_price: 50,
        total_price: 100
    };
    
    const { data: item, error: itemError } = await supabase
        .from('order_items')
        .insert(itemData)
        .select();
        
    if (itemError) {
        console.error("Item Insert Error:", itemError);
    } else {
        console.log("Success! Inserted Item.");
    }
}

testInsert();
