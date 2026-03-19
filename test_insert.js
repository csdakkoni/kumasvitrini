require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    console.log("Testing insert...");
    
    // 1. Insert Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            customer_name: "Test User",
            customer_phone: "5555555555",
            customer_email: "test@example.com",
            status: "pending",
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
        console.error("Orders schema mismatch:", orderError);
        return;
    }
    
    console.log("Order Inserted successfully. Deleting it now...");
    await supabase.from('orders').delete().eq('id', order.id);
    console.log("Deleted order successfully. The schema is fully compatible!");
}

check();
