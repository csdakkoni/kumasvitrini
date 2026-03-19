const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testOrders() {
    // Test with SERVICE ROLE key (admin)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data: adminOrders, error: adminError } = await supabaseAdmin
        .from('orders')
        .select('id, order_number, customer_name, status, payment_status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
    
    console.log('=== SERVICE ROLE KEY ===');
    console.log('Error:', adminError);
    console.log('Orders found:', adminOrders?.length || 0);
    if (adminOrders) {
        adminOrders.forEach(o => console.log(`  - ${o.order_number} | ${o.customer_name} | ${o.status} | ${o.payment_status}`));
    }

    // Test with ANON key (what the admin page uses)
    const supabaseAnon = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data: anonOrders, error: anonError } = await supabaseAnon
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false })
        .limit(10);
    
    console.log('\n=== ANON KEY ===');
    console.log('Error:', anonError);
    console.log('Orders found:', anonOrders?.length || 0);
    if (anonOrders) {
        anonOrders.forEach(o => console.log(`  - ${o.order_number} | ${o.customer_name} | items: ${o.items?.length || 0}`));
    }
}

testOrders();
